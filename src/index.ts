import http from "http";
import SocketService from "./services/socket";

async function init() {
    const ss = new SocketService();
    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;

    ss.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log("HEllo from port: ", PORT);
    });

    ss.initListeners();
}

init();
