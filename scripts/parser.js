// parser.js

import { Parser, Lexer, Token, Error } from './core-engine';

class CoreParser extends Parser {
  constructor(lexer) {
    super(lexer);
    this.lexer = lexer;
  }

  parseProgram() {
    let token = this.lexer.getNextToken();
    while (token !== Token.EOF) {
      this.parseStatement();
      token = this.lexer.getNextToken();
    }
  }

  parseStatement() {
    let token = this.lexer.getCurrentToken();
    switch (token) {
      case Token.KEYWORD_IF:
        this.parseIfStatement();
        break;
      case Token.KEYWORD_WHILE:
        this.parseWhileLoop();
        break;
      case Token.KEYWORD_FUNCTION:
        this.parseFunctionDeclaration();
        break;
      default:
        throw new Error(`Unexpected token: ${token}`);
    }
  }

  parseIfStatement() {
    let token = this.lexer.getNextToken();
    if (token !== Token.KEYWORD_IF) {
      throw new Error(`Expected keyword 'if', but got ${token}`);
    }
    this.lexer.getNextToken(); // Consume 'if'
    token = this.lexer.getNextToken();
    if (token !== Token.OPEN_PAREN) {
      throw new Error(`Expected '(', but got ${token}`);
    }
    let condition = this.parseExpression();
    if (condition.type !== 'boolean') {
      throw new Error(`Condition must be a boolean expression, but is ${condition.type}`);
    }
    this.lexer.getNextToken(); // Consume ')'
    let thenBranch = this.parseStatement();
    let elseBranch = null;
    token = this.lexer.getNextToken();
    if (token === Token.KEYWORD_ELSE) {
      this.lexer.getNextToken(); // Consume 'else'
      elseBranch = this.parseStatement();
    }
    this.lexer.getNextToken(); // Consume '}'
    this.parserResult = {
      type: 'ifStatement',
      condition: condition.value,
      then: thenBranch,
      else: elseBranch
    };
  }

  parseWhileLoop() {
    let token = this.lexer.getNextToken();
    if (token !== Token.KEYWORD_WHILE) {
      throw new Error(`Expected keyword 'while', but got ${token}`);
    }
    this.lexer.getNextToken(); // Consume 'while'
    token = this.lexer.getNextToken();
    if (token !== Token.OPEN_PAREN) {
      throw new Error(`Expected '(', but got ${token}`);
    }
    let condition = this.parseExpression();
    if (condition.type !== 'boolean') {
      throw new Error(`Condition must be a boolean expression, but is ${condition.type}`);
    }
    this.lexer.getNextToken(); // Consume ')'
    let body = this.parseStatement();
    this.lexer.getNextToken(); // Consume '}'
    this.parserResult = {
      type: 'whileLoop',
      condition: condition.value,
      body: body
    };
  }

  parseFunctionDeclaration() {
    let token = this.lexer.getNextToken();
    if (token !== Token.KEYWORD_FUNCTION) {
      throw new Error(`Expected keyword 'function', but got ${token}`);
    }
    this.lexer.getNextToken(); // Consume 'function'
    token = this.lexer.getNextToken();
    let functionName = token.value;
    this.lexer.getNextToken(); // Consume function name
    let params = this.parseParameterList();
    this.lexer.getNextToken(); // Consume '('
    let body = this.parseBlock();
    this.parserResult = {
      type: 'functionDeclaration',
      name: functionName,
      params: params,
      body: body
    };
  }

  parseParameterList() {
    let params = [];
    while (this.lexer.getCurrentToken() !== Token.CLOSE_PAREN) {
      params.push(this.parseParameter());
      this.lexer.getNextToken();
    }
    return params;
  }

  parseParameter() {
    let token = this.lexer.getCurrentToken();
    if (token === Token.IDENTIFIER) {
      let name = token.value;
      this.lexer.getNextToken(); // Consume parameter name
      let type = this.parseType();
      return { name, type };
    } else {
      throw new Error(`Expected identifier, but got ${token}`);
    }
  }

  parseType() {
    let token = this.lexer.getCurrentToken();
    switch (token) {
      case Token.KEYWORD_INT:
        this.lexer.getNextToken(); // Consume 'int'
        return 'int';
      case Token.KEYWORD_STRING:
        this.lexer.getNextToken(); // Consume 'string'
        return 'string';
      default:
        throw new Error(`Expected type, but got ${token}`);
    }
  }

  parseBlock() {
    let statements = [];
    let token = this.lexer.getCurrentToken();
    if (token !== Token.OPEN_BRACE) {
      throw new Error(`Expected '{', but got ${token}`);
    }
    while (this.lexer.getCurrentToken() !== Token.CLOSE_BRACE) {
      statements.push(this.parseStatement());
    }
    this.lexer.getNextToken(); // Consume '}'
    return statements;
  }

  parseExpression() {
    let token = this.lexer.getNextToken();
    switch (token) {
      case Token.KEYWORD_TRUE:
        this.parserResult = { type: 'boolean', value: true };
        break;
      case Token.KEYWORD_FALSE:
        this.parserResult = { type: 'boolean', value: false };
        break;
      case Token.NUMBER:
        this.parserResult = { type: 'number', value: parseInt(token.value) };
        break;
      case Token.STRING:
        this.parserResult = { type: 'string', value: token.value };
        break;
      case Token.IDENTIFIER:
        this.parserResult = { type: 'variable', value: token.value };
        break;
      case Token.OPEN_PAREN:
        let expression = this.parseExpression();
        this.lexer.getNextToken(); // Consume ')'
        this.parserResult = { type: 'group', expression };
        break;
      default:
        throw new Error(`Unexpected token: ${token}`);
    }
    return this.parserResult;
  }
}

export default CoreParser;