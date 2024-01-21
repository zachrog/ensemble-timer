function App() {
  return (
    <>
      <div className="opacity-100">
        <h1 className="bg-green-500">Yo this is the heading</h1>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          window.ipcRenderer.send('whatever-channel', 'Change transparency');
        }}
      >
        Change Transparency!
      </button>
    </>
  );
}

export default App;
