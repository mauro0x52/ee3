/** Testes  Companies.Image
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Image do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    rand = require("../Utils.js").rand,
    user, company, product;

describe('POST /company/:company_slug/product/:product_slug/image', function() {
    it('token inválido');
    it('empresa não existe');
    it('empresa sem produtos');
    it('produto não existe');
    it('empresa de outro usuário');
    it('não escolhe imagem');
    it('envia imagem');
});

describe('GET /company/:company_slug/product/:product_slug/images', function() {
    it('empresa não existe');
    it('produto não existe');
    it('empresa sem produtos');
    it('produto sem imagens');
    it('lista de imagens');
});

describe('GET /company/:company_slug/product/:product_slug/image/:id', function() {
    it('empresa não existe');
    it('produto não existe');
    it('empresa sem produtos');
    it('produto sem imagens');
    it('imagem não existe');
    it('dados da imagens');
});

describe('PUT /company/:company_slug/product/:product_slug/image/:id', function() {
    it('empresa não existe');
    it('produto não existe');
    it('empresa sem produtos');
    it('produto sem imagens');
    it('imagem não existe');
    it('edita dados da imagem');
});

describe('DEL /company/:company_slug/product/:product_slug/image/:id', function() {
    it('empresa não existe');
    it('produto não existe');
    it('empresa sem produtos');
    it('produto sem imagens');
    it('imagem não existe');
    it('apaga imagem');
});