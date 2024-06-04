import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function FileUploader() {
  const [data, setData] = useState([]);
  const [validationResult, setValidationResult] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("typeA");

  const schemas = {
    typeA: {
      ads: 'number',
      ddd: 'number'
    },
    typeB: {
      name: 'string',
      surname: 'string'
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        validateData(data, file);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const validateData = (data,file) => {
    const schema = schemas[selectedSchema];
    let isValid = true;
    for (let row of data) {
      for (let key in schema) {
        if (typeof row[key] !== schema[key]) {
          isValid = false;
          break;
        }
      }
      if (!isValid) break;
    }
    if (isValid) {
      setData(file);
      setValidationResult("File is valid!");
    } else {
      setValidationResult(`Invalid file format for ${selectedSchema}.`);
    }
  };
 
  return (
    <div>
      <div>
        <select onChange={(e) => setSelectedSchema(e.target.value)} value={selectedSchema}>
          <option value="typeA">Type A</option>
          <option value="typeB">Type B</option>
        </select>
      </div>
      <input type="file" accept=".xlsx, .xls" value={
        data.length > 0 ? data.name : ""
      } onChange={handleFileChange} />
      <div>{validationResult}</div>
      {data.length > 0 && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default FileUploader;
