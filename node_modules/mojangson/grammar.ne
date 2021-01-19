@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

MAIN -> _ JVALUE _ {% (d) => d[1] %}

JVALUE -> "true"  {% (d) => true %}
        | "false" {% (d) => false %}
        | JOBJECT {% (d) => d[0] %}
        | "'" _ JOBJECT _ "'" {% (d) => d[2] %}
        | JARRAY  {% (d) => d[0] %}
        | STRING  {% (d) => d[0] %}
        | "null"  {% (d) => null %}

JOBJECT -> "{" _ "}" {% (d) => { return {} } %}
         | "{" _ PAIR ( _ "," _ PAIR):* (_ ","):? "}" {% extractObject %}

JARRAY -> "[" _ "]" {% (d) => [] %}
        | "[" _ JVALUE ( _ "," _ JVALUE):* (_ ","):? _ "]" {% extractArray %}
        | "[" _ PAIR ( _ "," _ PAIR):* (_ ","):? _ "]" {% extractArrayPair %}

PAIR -> STRING _ ":" _ JVALUE {% (d) => [d[0], d[4]] %}

STRING -> "\"" [^\\"]:* "\"" {% (d) => parseValue(d[1].join('')) %}
        | [^\"\'}\]:,\s]:+ {% (d) => parseValue(d[0].join('')) %} 

@{%

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

%}
