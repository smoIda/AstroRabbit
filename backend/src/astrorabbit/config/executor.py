# TIMEOUT - if this X operation hasn't completed within Y seconds, cancel/fail it
DEFAULT_HTTP_TIMEOUT = 10
DEFAULT_DATABASE_TIMEOUT = 5
DEFAULT_EXECUTION_TIMEOUT = 10

# MAX_TIMEOUT - Maximum time an operation is allowed to wait
MAX_HTTP_TIMEOUT = 10
MAX_DATABASE_TIMEOUT = 5
MAX_EXECUTION_TIMEOUT = 10

# RETRY - Maximum number of retires for a retryable node failure
# HTTP 500           → maybe retry
# connection timeout → retry
# HTTP 400           → don't retry
# HTTP 401           → don't retry
# HTTP 404           → don't retry 
# --> Delete these later when I done setting up a proper retry system
MAX_RETRIES = 3

MAX_RESPONSE_SIZE = ...
