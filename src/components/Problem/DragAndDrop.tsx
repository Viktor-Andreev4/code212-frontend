function DragDropFile() {
    return (
      <form id="form-file-upload">
        <input type="file" id="input-file-upload" multiple={true} />
        <label id="label-file-upload" htmlFor="input-file-upload">
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button">Upload a file</button>
          </div> 
        </label>
      </form>
    );
  };

export default DragDropFile;