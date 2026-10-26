export const pyodideBaseUrl = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'

export type PyodideRuntime = {
  globals: {
    set: (name: string, value: unknown) => void
    get: (name: string) => unknown
  }
  runPythonAsync: (code: string) => Promise<unknown>
}

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideRuntime>
    sinaupyWriteTerminal?: (text: string, isStderr: boolean) => void
    sinaupyRequestInput?: (promptText: string) => Promise<string>
    sinaupyIsStopRequested?: () => boolean
  }
}

export type ExecutionStatus =
  | 'idle'
  | 'loading'
  | 'running'
  | 'waiting_input'
  | 'finished'
  | 'stopped'
  | 'error'

export type TerminalChunk = {
  id: string
  text: string
  type: 'stdout' | 'stderr' | 'input' | 'system'
}

let pyodidePromise: Promise<PyodideRuntime> | undefined

export function getPyodide(): Promise<PyodideRuntime> {
  if (pyodidePromise) return pyodidePromise

  if (window.loadPyodide) {
    pyodidePromise = window.loadPyodide({ indexURL: pyodideBaseUrl })
    return pyodidePromise
  }

  pyodidePromise = new Promise<PyodideRuntime>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${pyodideBaseUrl}pyodide.js`
    script.async = true
    script.onload = () => {
      if (!window.loadPyodide) {
        reject(new Error('Runtime Python tidak berhasil dimuat.'))
        return
      }
      void window.loadPyodide({ indexURL: pyodideBaseUrl }).then(resolve, reject)
    }
    script.onerror = () =>
      reject(
        new Error(
          'Tidak dapat mengunduh runtime Python. Periksa koneksi internet lalu coba lagi.'
        )
      )
    document.head.appendChild(script)
  })

  void pyodidePromise.catch(() => {
    pyodidePromise = undefined
  })

  return pyodidePromise
}

export const PYTHON_INTERACTIVE_RUNNER = `
import ast
import asyncio
import sys
import traceback
import builtins
import js

class SinauPyTerminalWriter:
    def __init__(self, is_stderr=False):
        self.is_stderr = is_stderr

    def write(self, s):
        if s:
            try:
                js.sinaupyWriteTerminal(str(s), self.is_stderr)
            except Exception:
                pass

    def flush(self):
        pass

_sinaupy_checkpoint_counter = 0

async def _sinaupy_checkpoint():
    global _sinaupy_checkpoint_counter
    _sinaupy_checkpoint_counter += 1
    # Cooperative yield every 100 iterations
    if _sinaupy_checkpoint_counter % 100 == 0:
        if js.sinaupyIsStopRequested():
            raise KeyboardInterrupt("Program dihentikan oleh pengguna.")
        await asyncio.sleep(0)

async def _sinaupy_input(*args, **kwargs):
    if js.sinaupyIsStopRequested():
        raise KeyboardInterrupt("Program dihentikan oleh pengguna.")

    prompt_str = ""
    if args:
        prompt_str = str(args[0])
    elif "prompt" in kwargs:
        prompt_str = str(kwargs["prompt"])

    # Stream prompt immediately to terminal
    if prompt_str:
        sys.stdout.write(prompt_str)
        sys.stdout.flush()

    # Await input from JavaScript interactive terminal Promise
    val = await js.sinaupyRequestInput(prompt_str)

    if js.sinaupyIsStopRequested():
        raise KeyboardInterrupt("Program dihentikan oleh pengguna.")

    return str(val)

class SinauPyASTTransformer(ast.NodeTransformer):
    def __init__(self):
        super().__init__()
        self.async_functions = set()

    def visit_Call(self, node):
        self.generic_visit(node)
        if isinstance(node.func, ast.Name) and node.func.id == 'input':
            new_call = ast.Call(
                func=ast.Name(id='_sinaupy_input', ctx=ast.Load()),
                args=node.args,
                keywords=node.keywords
            )
            ast.copy_location(new_call, node)
            new_node = ast.Await(value=new_call)
            ast.copy_location(new_node, node)
            return new_node
        return node

    def visit_FunctionDef(self, node):
        self.generic_visit(node)
        has_await = any(isinstance(n, ast.Await) for n in ast.walk(node))
        if has_await:
            self.async_functions.add(node.name)
            new_func = ast.AsyncFunctionDef(
                name=node.name,
                args=node.args,
                body=node.body,
                decorator_list=node.decorator_list,
                returns=node.returns,
                type_comment=getattr(node, 'type_comment', None)
            )
            ast.copy_location(new_func, node)
            return new_func
        return node

    def visit_While(self, node):
        self.generic_visit(node)
        checkpoint_node = ast.Expr(
            value=ast.Await(
                value=ast.Call(
                    func=ast.Name(id='_sinaupy_checkpoint', ctx=ast.Load()),
                    args=[],
                    keywords=[]
                )
            )
        )
        node.body.insert(0, checkpoint_node)
        return node

    def visit_For(self, node):
        self.generic_visit(node)
        checkpoint_node = ast.Expr(
            value=ast.Await(
                value=ast.Call(
                    func=ast.Name(id='_sinaupy_checkpoint', ctx=ast.Load()),
                    args=[],
                    keywords=[]
                )
            )
        )
        node.body.insert(0, checkpoint_node)
        return node

class SinauPyAsyncCallTransformer(ast.NodeTransformer):
    def __init__(self, async_funcs):
        super().__init__()
        self.async_funcs = async_funcs

    def visit_Call(self, node):
        self.generic_visit(node)
        if isinstance(node.func, ast.Name) and node.func.id in self.async_funcs:
            new_node = ast.Await(value=node)
            ast.copy_location(new_node, node)
            return new_node
        return node

async def _sinaupy_run_user_code(user_code_str):
    global _sinaupy_checkpoint_counter
    _sinaupy_checkpoint_counter = 0

    orig_stdout = sys.stdout
    orig_stderr = sys.stderr
    sys.stdout = SinauPyTerminalWriter(False)
    sys.stderr = SinauPyTerminalWriter(True)

    try:
        parsed_tree = ast.parse(user_code_str, filename="<program>")
        transformer = SinauPyASTTransformer()
        transformed_tree = transformer.visit(parsed_tree)

        if transformer.async_functions:
            call_transformer = SinauPyAsyncCallTransformer(transformer.async_functions)
            transformed_tree = call_transformer.visit(transformed_tree)

        ast.fix_missing_locations(transformed_tree)
        code_obj = compile(transformed_tree, filename="<program>", mode="exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)

        user_globals = {
            "__builtins__": builtins,
            "__name__": "__main__",
            "_sinaupy_input": _sinaupy_input,
            "_sinaupy_checkpoint": _sinaupy_checkpoint,
        }

        result = eval(code_obj, user_globals)
        if asyncio.iscoroutine(result):
            await result

    except KeyboardInterrupt:
        sys.stderr.write("\\n[Program dihentikan oleh pengguna]\\n")
    except SyntaxError as e:
        lines = traceback.format_exception_only(type(e), e)
        sys.stderr.write("".join(lines))
    except Exception as e:
        lines = traceback.format_exc()
        filtered_lines = [l for l in lines.splitlines(True) if "_sinaupy" not in l]
        sys.stderr.write("".join(filtered_lines))
    finally:
        sys.stdout = orig_stdout
        sys.stderr = orig_stderr
`

