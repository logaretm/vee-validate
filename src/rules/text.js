export default (value) => ! Array.isArray(value) 
  && /^[a-zA-Z0-9_&@;"'()?/:,!=\.\-\r\n\s]*$/.test(value);
