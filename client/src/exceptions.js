function UnhandledException() {
    this.name = "Unhandled Exception";
    this.message = "An unexpected error occurred.";
}

function IllegalArgumentException(message) {
    this.name = "Illegal Argument Exception";
    this.message = message || "An illegal argument was supplied";
}

