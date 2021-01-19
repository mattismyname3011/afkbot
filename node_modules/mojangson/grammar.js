// Generated automatically by nearley, version 2.19.7
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


// Because of unquoted strings, parsing can be ambiguous.
// It is more efficient to have the parser extract string
// and post-process it to retrieve numbers
function parseValue (str) {
  const suffixes = "bslfdiBSLFDI"
  const lastC = str.charAt(str.length - 1)
  if (suffixes.indexOf(lastC) !== -1) {
    const v = parseFloat(str.substring(0, str.length - 1))
    if (!isNaN(v)) return v
    return str
  }
  const v = parseFloat(str)
  if (!isNaN(v)) return v
  return str
}

function extractPair(kv, output) {
  if (kv[0] !== undefined) {
    output[kv[0]] = kv[1]
  }
}

function extractObject(d) {
  let output = {}
  extractPair(d[2], output)
  for (let i in d[3]) {
    extractPair(d[3][i][3], output)
  }
  return output
}

function extractArray (d) {
  let output = [d[2]]
  for (let i in d[3]) {
    output.push(d[3][i][3])
  }
  return output
}

function extractArrayPair (d) {
  let output = []
  extractPair(d[2], output)
  for (let i in d[3]) {
    extractPair(d[3][i][3], output)
  }
  return output
}

var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "MAIN", "symbols": ["_", "JVALUE", "_"], "postprocess": (d) => d[1]},
    {"name": "JVALUE$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "JVALUE", "symbols": ["JVALUE$string$1"], "postprocess": (d) => true},
    {"name": "JVALUE$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "JVALUE", "symbols": ["JVALUE$string$2"], "postprocess": (d) => false},
    {"name": "JVALUE", "symbols": ["JOBJECT"], "postprocess": (d) => d[0]},
    {"name": "JVALUE", "symbols": [{"literal":"'"}, "_", "JOBJECT", "_", {"literal":"'"}], "postprocess": (d) => d[2]},
    {"name": "JVALUE", "symbols": ["JARRAY"], "postprocess": (d) => d[0]},
    {"name": "JVALUE", "symbols": ["STRING"], "postprocess": (d) => d[0]},
    {"name": "JVALUE$string$3", "symbols": [{"literal":"n"}, {"literal":"u"}, {"literal":"l"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "JVALUE", "symbols": ["JVALUE$string$3"], "postprocess": (d) => null},
    {"name": "JOBJECT", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": (d) => { return {} }},
    {"name": "JOBJECT$ebnf$1", "symbols": []},
    {"name": "JOBJECT$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "PAIR"]},
    {"name": "JOBJECT$ebnf$1", "symbols": ["JOBJECT$ebnf$1", "JOBJECT$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "JOBJECT$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "JOBJECT$ebnf$2", "symbols": ["JOBJECT$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "JOBJECT$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "JOBJECT", "symbols": [{"literal":"{"}, "_", "PAIR", "JOBJECT$ebnf$1", "JOBJECT$ebnf$2", {"literal":"}"}], "postprocess": extractObject},
    {"name": "JARRAY", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": (d) => []},
    {"name": "JARRAY$ebnf$1", "symbols": []},
    {"name": "JARRAY$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "JVALUE"]},
    {"name": "JARRAY$ebnf$1", "symbols": ["JARRAY$ebnf$1", "JARRAY$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "JARRAY$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "JARRAY$ebnf$2", "symbols": ["JARRAY$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "JARRAY$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "JARRAY", "symbols": [{"literal":"["}, "_", "JVALUE", "JARRAY$ebnf$1", "JARRAY$ebnf$2", "_", {"literal":"]"}], "postprocess": extractArray},
    {"name": "JARRAY$ebnf$3", "symbols": []},
    {"name": "JARRAY$ebnf$3$subexpression$1", "symbols": ["_", {"literal":","}, "_", "PAIR"]},
    {"name": "JARRAY$ebnf$3", "symbols": ["JARRAY$ebnf$3", "JARRAY$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "JARRAY$ebnf$4$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "JARRAY$ebnf$4", "symbols": ["JARRAY$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "JARRAY$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "JARRAY", "symbols": [{"literal":"["}, "_", "PAIR", "JARRAY$ebnf$3", "JARRAY$ebnf$4", "_", {"literal":"]"}], "postprocess": extractArrayPair},
    {"name": "PAIR", "symbols": ["STRING", "_", {"literal":":"}, "_", "JVALUE"], "postprocess": (d) => [d[0], d[4]]},
    {"name": "STRING$ebnf$1", "symbols": []},
    {"name": "STRING$ebnf$1", "symbols": ["STRING$ebnf$1", /[^\\"]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "STRING", "symbols": [{"literal":"\""}, "STRING$ebnf$1", {"literal":"\""}], "postprocess": (d) => parseValue(d[1].join(''))},
    {"name": "STRING$ebnf$2", "symbols": [/[^\"\'}\]:,\s]/]},
    {"name": "STRING$ebnf$2", "symbols": ["STRING$ebnf$2", /[^\"\'}\]:,\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "STRING", "symbols": ["STRING$ebnf$2"], "postprocess": (d) => parseValue(d[0].join(''))}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
