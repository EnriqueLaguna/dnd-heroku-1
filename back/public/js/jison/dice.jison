%lex

%%
\s+                               /* skip whitespace */
[0-9]+                            return 'INTEGER';

[d]                               return 'SIMPLE_DICE';

"*"                               return 'MUL';
"/"                               return 'DIV';
"-"                               return 'RES';
"+"                               return 'SUM';

"("                               return 'LPAREN';
")"                               return 'RPAREN';

<<EOF>>                           return 'EOF';

/lex

%left SUM RES
%left MUL DIV
%right SIMPLE_DICE
%left DROP_L KEEP_L DROP_H KEEP_H

%start result

%%

check_content
    : INTEGER                     { $$ = [$1] }
    ;

dice
    : SIMPLE_DICE group_or_int    { $$ = '(new Dice(1, ' + $2 + '))' }
    ;

simple_roll
    : group_or_int dice           { $$ = $2 + '.roll(' + $1 + ')' }
    | dice                        { $$ = $1 + '.roll(1)' }
    ;

roll
    : simple_roll                 { $$ = $1 }
    ;

concat_entry
    : group_or_int                { $$ = $1 }
    | roll                        { $$ = $1 }
    ;

group_or_int
    : INTEGER                     { $$ = $1 }
    | LPAREN expression RPAREN          { $$ = '(' + $2 + ')' }
    ;

expression
    : expression SUM expression   { $$ = '(' + $1 + '+' + $3 + ')' }
    | expression RES expression   { $$ = '(' + $1 + '-' + $3 + ')' }
    | expression MUL expression   { $$ = '(' + $1 + '*' + $3 + ')' }
    | expression DIV expression   { $$ = '(' + $1 + '/' + $3 + ')' }
    | concat_entry                { $$ = $1 }
    ;

grouped_notation
    : expression                  { $$ = '.push(' + $1 + ').exec()' }
    ;

result
    : grouped_notation EOF        { return '(new Result())' + $1 + '.evaluate()' }
    ;