const TOKEN_TYPE = {
    OPEN_BRACE: 'OPEN_BRACE',
    CLOSE_BRACE: 'CLOSE_BRACE',
    OPEN_PAREN: 'OPEN_PAREN',
    CLOSE_PAREN: 'CLOSE_PAREN',
    COLON: 'COLON',
    COMMA: 'COMMA',
    QUOTE: 'QUOTE',
    INDENT: 'INDENT',
    LINE_BREAK: 'LINE_BREAK',
    LITERAL: 'LITERAL',
    KEYWORD: 'KEYWORD',
    IDENTIFIER: 'IDENTIFIER',
    FLOAT: 'FLOAT',
    SHAPE_ID: 'SHAPE_ID',
    EOF: 'EOF',
    INVALID: 'INVALID'
}

class Token {
    type;
    spelling;

    constructor(tokenType, spelling) {
        this.type = tokenType;
        this.spelling = spelling;
    }
}