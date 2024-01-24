import { useEffect } from "react";
import { RendererWindowBrowser } from "../communicationBridge/fakeWindowBrowser";

export function EditEnsemble() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  return (
    <>
      <h1>Hey you are in edit mode</h1>
    </>
  );
}
