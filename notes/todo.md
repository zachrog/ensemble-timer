Handle multiple screens
- Only have a single window but allow it to be moved between screens.(Not possible)
  + Do not need to share state accross multiple screens.
  + All state can remain within the react app and the main process can be a dummy.
  - May not be possible to modify if a window has a frame or not once started.
- Only have a single window. When switching from timer mode to full display mode destroy the window and recreate with a frame. When switching to timer mode destroy window and create another without a frame.
  + Means only one window ever needs to be monitored at a time.
  - If windows are being destroyed and recreated then passing state around is going to be difficult
- Duplicate the window for every screen the user has.
  + Allows all screens to be taken over and shows the user the state no matter where they look.
  - Because state cannot be shared in React, the main process would have to maintain state and pass that state to all child windows. This could get pretty complex depending on the user interaction and what is contained in state.
- Only one window but create a custom title bar that I can show and hide depending on state.