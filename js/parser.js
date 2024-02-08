class Parser {
    tokens = [];
    isValidSyntax;
    lookaheadToken;
    type;
    spelling;
    currentIndex;

    constructor(tokens) {
        this.tokens = tokens;
        this.tokens.push(new Token(TOKEN_TYPE.EOF, '$'));
        this.currentIndex = 0;
        this.lookaheadToken = this.tokens[this.currentIndex];
        this.type = this.lookaheadToken.type;
        this.spelling = this.lookaheadToken.spelling;
        this.isValidSyntax = true;
    }

    acceptToken(expectedTokenType) {
        if (this.type === expectedTokenType) {
            this.currentIndex++;
            this.lookaheadToken = this.tokens[this.currentIndex];    
            this.type = this.lookaheadToken.type;
            this.spelling = this.lookaheadToken.spelling;
        } else 
            this.rejectToken();
    }

    rejectToken() {
        this.isValidSyntax = false;
        throw new Error(`Unexpected token type found: ${this.lookaheadToken.type} (${this.lookaheadToken.spelling})`);
    }

    parse() {
        this.parseProgram();
    }

    parseProgram() {
        if (this.type === TOKEN_TYPE.IDENTIFIER) {
            this.parseNodeDeclarators();
            this.parseNodeList();
        } else if (this.type === TOKEN_TYPE.KEYWORD && this.spelling === 'root') {
            this.parseNodeList();
        } else
            this.rejectToken();

        if (this.type != TOKEN_TYPE.EOF && this.spelling != '$')
            this.rejectToken();
        else 
            console.log('success');
    }

    parseNodeDeclarators() {
        if (this.type === TOKEN_TYPE.KEYWORD && this.spelling === 'root')
            return;
        
        this.parseNodeDeclarator();
        this.parseNodeDeclarators();
    }

    parseNodeDeclarator() {
        this.parseNodeId();
        this.parseNodeConfigs();
    }

    parseNodeList() {
        if (this.spelling === 'root') {
            this.acceptToken(TOKEN_TYPE.KEYWORD);
            this.parseNodeConfigs();
            this.parseNodeListDeclarator();
        } else 
            this.rejectToken();
    }

    parseNodeListDeclarator() {
        if (this.type === TOKEN_TYPE.EOF && this.spelling === '$')  
            return;
        this.acceptToken(TOKEN_TYPE.LINE_BREAK);
        this.parseIndent();
        this.parseNodeListItem();
        this.parseNodeListDeclarator();
    }

    parseNodeListItem() {
        if (this.type === TOKEN_TYPE.IDENTIFIER)
            this.parseNodeId();
        else if (this.type === TOKEN_TYPE.OPEN_BRACE)
            this.parseNodeConfigs();
        else 
            this.rejectToken();
    }

    parseNodeId() {
        this.acceptToken(TOKEN_TYPE.IDENTIFIER);
    }

    parseNodeConfigs() {
        this.acceptToken(TOKEN_TYPE.OPEN_BRACE);
        this.parseNodeConfigDeclarator();
        this.acceptToken(TOKEN_TYPE.CLOSE_BRACE);
    }

    parseNodeConfigDeclarator() {
        if (this.type === TOKEN_TYPE.CLOSE_BRACE)
            return;
        this.parseNodeConfig();
        this.parseMoreNodeConfig();
    }

    parseMoreNodeConfig() {
        if (this.type === TOKEN_TYPE.CLOSE_BRACE)
            return;
        this.acceptToken(TOKEN_TYPE.COMMA);
        this.parseNodeConfig();
        this.parseMoreNodeConfig();
    }

    parseNodeConfig() {
        const config = this.spelling;
        this.acceptToken(TOKEN_TYPE.KEYWORD);
        this.acceptToken(TOKEN_TYPE.COLON);
        if (config === 'content')
            this.parseLiteral();
        else if (config === 'color')
            this.parseRgba();
        else if (config === 'shape')
            this.parseShapeId();
    }

    parseLiteral() {
        this.acceptToken(TOKEN_TYPE.QUOTE);
        this.acceptToken(TOKEN_TYPE.LITERAL);
        this.acceptToken(TOKEN_TYPE.QUOTE);
    }

    parseRgba() {
        if (this.spelling === 'rgba') {
            this.acceptToken(TOKEN_TYPE.KEYWORD);
            this.acceptToken(TOKEN_TYPE.OPEN_PAREN);
            for (let i = 0; i < 3; i++) {
                this.parseFloat();
                this.acceptToken(TOKEN_TYPE.COMMA);
            }
            this.parseFloat();
            this.acceptToken(TOKEN_TYPE.CLOSE_PAREN);
        } else 
            this.rejectToken();
    }

    parseFloat() {
        this.acceptToken(TOKEN_TYPE.FLOAT);
    }

    parseLettersOrNumsOrSymbols() {

    }

    parseLettersOrNums() {}

    parseLetterOrNumOrSymbol() {

    }

    parseLetterOrNum() {


    }

    parseNums() {}
    parseNum() {}
    parseLetter() {
       
    }
    parseSymbol() {}

    parseIndent() {
        this.acceptToken(TOKEN_TYPE.INDENT);
    }

    parseShapeId() {
        this.acceptToken(TOKEN_TYPE.SHAPE_ID);
    }

    isLetter(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }
}