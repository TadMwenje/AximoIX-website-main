import azure.functions as func
from . import app

# This makes the folder a Python package and re-exports the app
function_app = func.FunctionApp(app=app)