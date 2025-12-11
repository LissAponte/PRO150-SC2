import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket() {

    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io("http://localhost:5000", {
            withCredentials: true,
        });

        return () => {
            if (socketRef.current){
                socketRef.current.disconnect();
        };
        socketRef.current = null;
        }
    }, []);

    return socketRef;
}