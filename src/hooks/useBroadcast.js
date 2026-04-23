import { useEffect } from "react";

export default function useBroadcast(setItems) {
  useEffect(() => {
    const channel = new BroadcastChannel("aptsync");

    channel.onmessage = (e) => {
      if (e.data.type === "SYNC") {
        setItems(e.data.items);
      }
    };

    return () => channel.close();
  }, []);
}
