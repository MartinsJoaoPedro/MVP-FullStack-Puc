from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote

from sqlalchemy.exc import IntegrityError

from model import Session, Produto
from logger import logger
from schemas import *
from flask_cors import CORS
from fastapi import Query

info = Info(title="Minha API", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

# definindo tags
home_tag = Tag(name="Documentação",
               description="Seleção de documentação: Swagger, Redoc ou RapiDoc")
produto_tag = Tag(
    name="Produto", description="Adição, visualização e remoção de produtos à base")


@app.get('/', tags=[home_tag])
def home():
    """Redireciona para /openapi, tela que permite a escolha do estilo de documentação.
    """
    return redirect('/openapi')

# Adicionar um produto
@app.post('/produto', tags=[produto_tag],
          responses={"200": ProdutoViewSchema, "409": ErrorSchema, "400": ErrorSchema})
def add_produto(form: ProdutoSchema):
    """Adiciona um novo Produto à base de dados

    Retorna uma representação dos produtos associados.
    """
    produto = Produto(
        nome=form.nome,
        quantidade=form.quantidade,
        valor=form.valor)
    logger.debug(f"Adicionando produto de nome: '{produto.nome}'")
    try:
        # criando conexão com a base
        session = Session()
        # adicionando produto
        session.add(produto)
        # efetivando o camando de adição de novo item na tabela
        session.commit()
        logger.debug(f"Adicionado produto de nome: '{produto.nome}'")
        return apresenta_produto(produto), 200

    except IntegrityError as e:
        # como a duplicidade do nome é a provável razão do IntegrityError
        error_msg = "Produto de mesmo nome já salvo na base :/"
        logger.warning(
            f"Erro ao adicionar produto '{produto.nome}', {error_msg}")
        return {"mesage": error_msg}, 409

    except Exception as e:
        # caso um erro fora do previsto
        error_msg = "Não foi possível salvar novo item :/"
        logger.warning(
            f"Erro ao adicionar produto '{produto.nome}', {error_msg}")
        return {"mesage": error_msg}, 400

# Pega todos os produtos
@app.get('/produtos', tags=[produto_tag],
         responses={"200": ListagemProdutosSchema, "404": ErrorSchema})
def get_produtos():
    """Faz a busca por todos os Produto cadastrados

    Retorna uma representação da listagem de produtos.
    """
    logger.debug(f"Coletando produtos ")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    produtos = session.query(Produto).all()

    if not produtos:
        # se não há produtos cadastrados
        return {"produtos": []}, 200
    else:
        logger.debug(f"%d rodutos econtrados" % len(produtos))
        # retorna a representação de produto
        return apresenta_produtos(produtos), 200
    

# Pega todos os produtos
@app.get('/produtosnome', tags=[produto_tag],
         responses={"200": ListagemProdutosSchema, "404": ErrorSchema})
def get_produtos_nome(query: ProdutoBuscaSchemaNome):
    """Faz a busca por todos os Produto cadastrados a partir do nome informado

    Retorna uma representação da listagem de produtos associados ao nome.
    """
    produto_nome = query.nome
    logger.debug(f"Coletando produtos ")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    produtos = session.query(Produto).filter(Produto.nome.contains(produto_nome)).all()

    if not produtos:
        # se não há produtos cadastrados
        return {"produtos": []}, 200
    else:
        logger.debug(f"%d rodutos econtrados" % len(produtos))  
        # retorna a representação de produto
        return apresenta_produtos(produtos), 200
    
# Pega todos os produtos
@app.get('/produtosquantidade', tags=[produto_tag],
         responses={"200": ListagemProdutosSchema, "404": ErrorSchema})
def get_produtos_quantidade(query: ProdutoBuscaSchemaQuantidade):
    """Faz a busca por todos os Produto cadastrados a partir da quantidade informada

    Retorna uma representação da listagem de produtos associados a quantidade.
    """
    produto_quantidade = query.quantidade
    logger.debug(f"Coletando produtos ")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    produtos = session.query(Produto).filter(Produto.quantidade.contains(produto_quantidade)).all()

    if not produtos:
        # se não há produtos cadastrados
        return {"produtos": []}, 200
    else:
        logger.debug(f"%d rodutos econtrados" % len(produtos))
        # retorna a representação de produto
        return apresenta_produtos(produtos), 200
    
# Pega todos os produtos
@app.get('/produtosvalor', tags=[produto_tag],
         responses={"200": ListagemProdutosSchema, "404": ErrorSchema})
def get_produtos_valor(query: ProdutoBuscaSchemaValor):
    """Faz a busca por todos os Produto cadastrados a partir do valor informado

    Retorna uma representação da listagem de produtos associados ao valor.
    """
    produto_valor = query.valor
    logger.debug(f"Coletando produtos ")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    produtos = session.query(Produto).filter(Produto.valor.contains(produto_valor)).all()

    if not produtos:
        # se não há produtos cadastrados
        return {"produtos": []}, 200
    else:
        logger.debug(f"%d rodutos econtrados" % len(produtos))
        # retorna a representação de produto
        return apresenta_produtos(produtos), 200





# Pega um produto especifico
@app.get('/produtoid', tags=[produto_tag],

         responses={"200": ProdutoViewSchema, "404": ErrorSchema})
def get_produto_id(query: ProdutoBuscaSchema):
    """Faz a busca por um Produto a partir do id do produto

    Retorna uma representação dos produtos associados ao id.
    """
    produto_id = query.id
    logger.debug(f"Coletando dados sobre produto #{produto_id}")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    produto = session.query(Produto).filter(Produto.id == produto_id).first()

    if not produto:
        # se o produto não foi encontrado
        error_msg = "Produto não encontrado na base :/"
        logger.warning(f"Erro ao buscar produto '{produto_id}', {error_msg}")
        return {"mesage": error_msg}, 404
    else:
        logger.debug(f"Produto econtrado: '{produto.id}'")
        # retorna a representação de produto
        return apresenta_produto(produto), 200

# Deleta produto especifico
@app.delete('/produto', tags=[produto_tag],
            responses={"200": ProdutoDelSchema, "404": ErrorSchema})
def del_produto(query: ProdutoBuscaSchema):
    """Deleta um Produto a partir do id informado

    Retorna uma mensagem de confirmação da remoção.
    """
    print(query.id)
    produto_id = query.id
    print(produto_id)
    Stringpi = str(produto_id)
    logger.debug(f"Deletando dados sobre produto #{Stringpi}")
    # criando conexão com a base
    session = Session()
    # fazendo a remoção
    count = session.query(Produto).filter(
        Produto.id == produto_id).delete()
    session.commit()

    if count:
        # retorna a representação da mensagem de confirmação
        logger.debug(f"Deletado produto #{Stringpi}")
        return {"mesage": "Produto removido", "id": Stringpi}
    else:
        # se o produto não foi encontrado
        error_msg = "Produto não encontrado na base :/"
        logger.warning(
            f"Erro ao deletar produto #'{Stringpi}', {error_msg}")
        return {"mesage": error_msg}, 404

@app.put('/produto', tags=[produto_tag],
         responses={"200": ProdutoDelSchema, "404": ErrorSchema})
def update_produto(query: ProdutoBuscaSchema, form: ProdutoUpdateSchema):
    """Edita um Produto a partir do id informado

    Retorna uma mensagem de confirmação da edição.
    """
    produto_id = query.id
    Stringpi = str(produto_id)
    logger.debug(f"Editando dados sobre produto #{Stringpi}")
    logger.debug(f"Editando dados sobre produto #{Stringpi}")
    # criando conexão com a base
    session = Session()
    # fazendo a remoção
    count = session.query(Produto).filter(
        # Produto.nome == produto_nome).first()
        Produto.id == produto_id).first()

    count.nome = form.nome
    count.valor = form.valor
    count.quantidade = form.quantidade

    print("nome")
    print(count.id)
    print(count.valor)
    print(count.nome)
    print(count.quantidade)

    session.commit()
    return apresenta_produto(count), 200
