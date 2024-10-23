import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { EntregasService } from "../rest/entregas.service";


@Injectable()
export class EntregasSocketService {
    private wss: Server;
    setServer(server: Server) {
        this.wss = server;
    }

    constructor(
        @Inject(forwardRef(() => EntregasService))
        private readonly entregasService: EntregasService,
    ) { }
}