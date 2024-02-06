const TOKEN_TYPE = {
    OPEN_BRACE: 'OPEN_BRACE',
    CLOSE_BRACE: 'CLOSE_BRACE',
    OPEN_PAREN: 'OPEN_PAREN',
    CLOSE_PAREN: 'CLOSE_PAREN',
    ASSIGNMENT: 'ASSIGNMENT',
    COLON: 'COLON',
    COMMA: 'COMMA',
    INDENT: 'INDENT',
    LINE_BREAK: 'LINE_BREAK',
    DASH: 'DASH',
    LITERAL: 'LITERAL',
    KEYWORD: 'KEYWORD',
    IDENTIFIER: 'IDENTIFIER',
    FLOAT: 'FLOAT',
    SHAPE_ID: 'SHAPE_ID',
    EOF: 'EOF',
    INVALID: 'INVALID'
}

class Token {
    tokenType;
    spelling;

    constructor(tokenType, spelling) {
        this.tokenType = tokenType;
        this.spelling = spelling;
    }
}