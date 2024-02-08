class Parser {
    tokens = [];
    isValidSyntax;
    lookaheadToken;
    type;
    spelling;
    currentIndex;
    errorText;
    resultText;

    constructor(tokens) {
        this.tokens = tokens;
        this.tokens.push(new Token(TOKEN_TYPE.EOF, '$'));
        this.currentIndex = 0;
        this.lookaheadToken = this.tokens[this.currentIndex];
        this.type = this.lookaheadToken.type;
        this.spelling = this.lookaheadToken.spelling;
        this.isValidSyntax = true;
        this.resultText = "";
    }

    appendResult(nonTermName, success, start) {
        if (start)
            this.resultText += `Parsing ${nonTermName}\n`;
        else {
            if (success)
                this.resultText += `Successfully parsed ${nonTermName}\n`;
            else if (!success) 
                this.resultText += `Failed to parse ${nonTermName}, program terminated\n`;
        }
    }

    acceptToken(expectedTokenType) {
        if (this.type === expectedTokenType) {
            this.currentIndex++;
            this.lookaheadToken = this.tokens[this.currentIndex];    
            this.type = this.lookaheadToken.type;
            this.spelling = this.lookaheadToken.spelling;
        } else 
            this.rejectToken(expectedTokenType);
    }

    rejectToken(expectedTokenType) {
        this.isValidSyntax = false;
        this.errorText = `Expecting ${expectedTokenType}, but found ${this.lookaheadToken.type} (${this.lookaheadToken.spelling})`;
        throw new Error(`${this.errorText}`);
    }

    parse() {
        this.parseProgram();
    }

    parseProgram() {
        this.appendResult('<program>', false, true);

        if (this.type === TOKEN_TYPE.IDENTIFIER) {
            this.parseNodeDeclarators();
            this.parseNodeList();
        } else if (this.type === TOKEN_TYPE.KEYWORD && this.spelling === 'root') {
            this.parseNodeList();
        } else {
            this.appendResult('<program>', false, false);
            this.rejectToken(TOKEN_TYPE.EOF);
        }

        if (this.type != TOKEN_TYPE.EOF && this.spelling != '$') {
            this.appendResult('<program>', false, false);
            this.rejectToken(TOKEN_TYPE.EOF);
        }

        this.appendResult('<program>', true, false);
    }

    parseNodeDeclarators() {
        if (this.type === TOKEN_TYPE.KEYWORD && this.spelling === 'root') {
            this.appendResult('<nodeDeclarators>', true, false);
            return;   
        }
        this.appendResult('<nodeDeclarators>', false, true);
        this.parseNodeDeclarator();
        this.appendResult('<nodeDeclarators>', true, false);
        this.parseNodeDeclarators();
    }

    parseNodeDeclarator() {
        this.appendResult('<nodeDeclarator>', false, true);
        this.parseNodeId();
        this.parseNodeConfigs();
        this.appendResult('<nodeDeclarator>', true, false);
    }

    parseNodeList() {
        this.appendResult('<nodeList>', false, true);
        if (this.spelling === 'root') {
            this.acceptToken(TOKEN_TYPE.KEYWORD);
            this.parseNodeConfigs();
            this.parseNodeListDeclarator();
            this.appendResult('<nodeList>', true, false);
        } else {
            this.appendResult('<nodeList>', false, false);
            this.rejectToken(`${TOKEN_TYPE.KEYWORD}: root`);
        }
    }

    parseNodeListDeclarator() {
        if (this.type === TOKEN_TYPE.EOF && this.spelling === '$') {
            this.appendResult('<nodeListDeclarator>', true, false);
            return;
        }
        this.appendResult('<nodeListDeclarator>', false, true);
        this.acceptToken(TOKEN_TYPE.LINE_BREAK);
        this.parseIndent();
        this.parseNodeListItem();
        this.appendResult('<nodeListDeclarator>', true, false);
        this.parseNodeListDeclarator();
    }

    parseNodeListItem() {
        this.appendResult('<nodeListItem>', false, true);
        if (this.type === TOKEN_TYPE.IDENTIFIER)
            this.parseNodeId();
        else if (this.type === TOKEN_TYPE.OPEN_BRACE)
            this.parseNodeConfigs();
        else {
            this.appendResult('<nodeListItem>', false, false);
            this.rejectToken(TOKEN_TYPE.IDENTIFIER + " or " + TOKEN_TYPE.OPEN_BRACE);
        }
    }

    parseNodeId() {
        this.appendResult('<nodeId>', false, true);
        this.acceptToken(TOKEN_TYPE.IDENTIFIER);
        this.appendResult('<nodeId>', true, false);
    }

    parseNodeConfigs() {
        this.appendResult('<nodeConfigs>', false, true);
        this.acceptToken(TOKEN_TYPE.OPEN_BRACE);
        this.parseNodeConfigDeclarator();
        this.acceptToken(TOKEN_TYPE.CLOSE_BRACE);
        this.appendResult('<nodeConfigs>', true, false);
    }

    parseNodeConfigDeclarator() {
        if (this.type === TOKEN_TYPE.CLOSE_BRACE) {
            this.appendResult('<nodeConfigDeclarator>', true, false);
            return;
        } 
        this.appendResult('<nodeConfigDeclarator>', false, true);
        this.parseNodeConfig();
        this.parseMoreNodeConfig();
    }

    parseMoreNodeConfig() {
        if (this.type === TOKEN_TYPE.CLOSE_BRACE) {
            this.appendResult('<moreNodeConfig>', true, false);
            return;
        }

        this.appendResult('<moreNodeConfig>', false, true);
        this.acceptToken(TOKEN_TYPE.COMMA);
        this.parseNodeConfig();
        this.parseMoreNodeConfig();
    }

    parseNodeConfig() {
        this.appendResult('<nodeConfig>', false, true);
        const config = this.spelling;
        this.acceptToken(TOKEN_TYPE.KEYWORD);
        this.acceptToken(TOKEN_TYPE.COLON);
        if (config === 'content')
            this.parseLiteral();
        else if (config === 'color')
            this.parseRgba();
        else if (config === 'shape')
            this.parseShapeId();
        this.appendResult('<nodeConfig>', true, false);
    }

    parseLiteral() {
        this.appendResult('<literal>', false, true);
        this.acceptToken(TOKEN_TYPE.QUOTE);
        this.acceptToken(TOKEN_TYPE.LITERAL);
        this.acceptToken(TOKEN_TYPE.QUOTE);
        this.appendResult('<literal>', true, false);
    }

    parseRgba() {
        if (this.spelling === 'rgba') {
            this.appendResult('<rgba>', false, true);
            this.acceptToken(TOKEN_TYPE.KEYWORD);
            this.acceptToken(TOKEN_TYPE.OPEN_PAREN);
            for (let i = 0; i < 3; i++) {
                this.parseFloat();
                this.acceptToken(TOKEN_TYPE.COMMA);
            }
            this.parseFloat();
            this.acceptToken(TOKEN_TYPE.CLOSE_PAREN);
            this.appendResult('<rgba>', true, false);
        } else {
            this.appendResult('<rgba>', false, false);
            this.rejectToken(`${TOKEN_TYPE.KEYWORD}: rgba`);
        }
    }

    parseFloat() {
        this.appendResult('<float>', false, true);
        this.acceptToken(TOKEN_TYPE.FLOAT);
        this.appendResult('<float>', true, false);
    }

    parseIndent() {
        this.appendResult('<indent>', false, true);
        this.acceptToken(TOKEN_TYPE.INDENT);
        this.appendResult('<indent>', true, false);
    }

    parseShapeId() {
        this.appendResult('<shapeId>', false, true);
        this.acceptToken(TOKEN_TYPE.SHAPE_ID);
        this.appendResult('<shapeId>', false, true);
    }
}