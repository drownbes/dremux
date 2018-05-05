const OPEN_BRACKET_REGEXP = /\"\<\|/;
const CLOSE_BRACKET_REGEXP = /\|\>\"/;
const regExpLength = 3;


const defaultBrackets = {
  OPEN_BRACKET : '\\"\\<\\|',
  CLOSE_BRACKET: '\\|\\>\\"'
}

function createBrackets(brackets) {
  const nb = {...brackets};
  Object.keys(nb).forEach(key => {
    nb[key] = {
      regexp: new RegExp(nb[key]),
      length: nb[key].replace(/\\/g,'').length
    }
  });
  return nb;
}

const parse = (brackets=defaultBrackets) => {
  let br = createBrackets(brackets)
  return (str) => {
    let matches = [];
    let curPos = 0;
    let leftStr, openBracket, closeBracket;
    do {
      leftStr = str.slice(curPos, str.length);
      openBracket = br.OPEN_BRACKET.regexp.exec(leftStr);
      if(openBracket) {
        let newMatch = {};
        newMatch.start = curPos + openBracket.index;
        curPos += openBracket.index + br.OPEN_BRACKET.length;
        leftStr = str.slice(curPos, str.length);
        closeBracket = br.CLOSE_BRACKET.regexp.exec(leftStr);
        if(!closeBracket) {
          break;
        }
        curPos += closeBracket.index + br.CLOSE_BRACKET.length;
        newMatch.end = curPos;
        newMatch.match = str.slice(
          newMatch.start + br.OPEN_BRACKET.length, newMatch.end - br.CLOSE_BRACKET.length
        ).trim();
        matches.push(newMatch);
      }
    } while(openBracket)
    return matches;
  };
}

//TODO: remove dublicate
const replace = replaceHash => matches => str => {
  if(str.length === 0 || matches.length === 0) return str;
  let curPos = 0;
  let retStr = "";

  matches.forEach(rm => {
    retStr += str.slice(curPos, rm.start);
    if(replaceHash.hasOwnProperty(rm.match)) {
      retStr += replaceHash[rm.match];
    } else {
      throw new Error(`no pattern in replace hash: ${rm.match}`);
    }
    curPos = rm.end;
  });
  retStr += str.slice(curPos, str.length);
  return retStr;
}

const replaceAbs = replaceMap => matches => str => {
  if(str.length === 0 || matches.length === 0) return str;
  let curPos = 0;
  let retStr = "";

  matches.forEach(rm => {
    retStr += str.slice(curPos, rm.start);
    if(replaceMap.has(rm.absPath)) {
      retStr += replaceMap.get(rm.absPath);
    } else {
      throw new Error(`no pattern in replace hash: ${rm.absPath}`);
    }
    curPos = rm.end;
  });
  retStr += str.slice(curPos, str.length);
  return retStr;
}


module.exports = {
  parse,
  replace,
  replaceAbs
}