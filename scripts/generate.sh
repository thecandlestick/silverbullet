#!/bin/sh -e

QUERY_GRAMMAR=common/markdown_parser/query.grammar
EXPRESSION_GRAMMAR=common/markdown_parser/expression.grammar.generated
TEMPLATE_GRAMMAR=common/template/template.grammar
LUA_GRAMMAR=common/space_lua/lua.grammar
LEZER_GENERATOR_VERSION=1.5.1

# Generate a patched grammer for just expressions
echo "@top Program { Expression }" > $EXPRESSION_GRAMMAR
tail -n +2 $QUERY_GRAMMAR >> $EXPRESSION_GRAMMAR

deno run -A npm:@lezer/generator@$LEZER_GENERATOR_VERSION $QUERY_GRAMMAR -o common/markdown_parser/parse-query.js
deno run -A npm:@lezer/generator@$LEZER_GENERATOR_VERSION $EXPRESSION_GRAMMAR -o common/markdown_parser/parse-expression.js
deno run -A npm:@lezer/generator@$LEZER_GENERATOR_VERSION $TEMPLATE_GRAMMAR -o common/template/parse-template.js
deno run -A npm:@lezer/generator@$LEZER_GENERATOR_VERSION $LUA_GRAMMAR -o common/space_lua/parse-lua.js