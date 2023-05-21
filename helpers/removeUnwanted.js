const removeUnwantedChars=(response)=> {
  return response.replace(/[.\n]/g, "");
}

export default removeUnwantedChars;
