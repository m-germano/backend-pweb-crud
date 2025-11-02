import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'GeoInfo Manager API',
      version: '1.0.0',
      description: 'CRUD de Continentes/Países/Cidades + integrações REST Countries & OpenWeatherMap',
    },
    servers: [{ url: 'http://localhost:3333' }],
    components: {
      schemas: {
        // ===== Domain (read model) =====
        Continent: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            descricao: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'nome', 'createdAt', 'updatedAt'],
        },
        Country: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            populacao: { type: 'integer' },
            idiomaOficial: { type: 'string' },
            moeda: { type: 'string' },
            fusoHorario: { type: 'string', nullable: true },
            iso2: { type: 'string', nullable: true },
            continentId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id','nome','populacao','idiomaOficial','moeda','continentId','createdAt','updatedAt'],
        },
        City: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            populacao: { type: 'integer' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            countryId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id','nome','populacao','latitude','longitude','countryId','createdAt','updatedAt'],
        },

        // ===== Input models =====
        ContinentCreateInput: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string' },
            descricao: { type: 'string', nullable: true },
          },
        },
        ContinentUpdateInput: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            descricao: { type: 'string', nullable: true },
          },
        },

        CountryCreateInput: {
          type: 'object',
          required: ['nome', 'populacao', 'idiomaOficial', 'moeda', 'continentId'],
          properties: {
            nome: { type: 'string' },
            populacao: { type: 'integer' },
            idiomaOficial: { type: 'string' },
            moeda: { type: 'string' },
            fusoHorario: { type: 'string', nullable: true },
            iso2: { type: 'string', nullable: true },
            continentId: { type: 'string', format: 'uuid' },
          },
        },
        CountryUpdateInput: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            populacao: { type: 'integer' },
            idiomaOficial: { type: 'string' },
            moeda: { type: 'string' },
            fusoHorario: { type: 'string', nullable: true },
            iso2: { type: 'string', nullable: true },
            continentId: { type: 'string', format: 'uuid' },
          },
        },

        CityCreateInput: {
          type: 'object',
          required: ['nome', 'populacao', 'latitude', 'longitude', 'countryId'],
          properties: {
            nome: { type: 'string' },
            populacao: { type: 'integer' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            countryId: { type: 'string', format: 'uuid' },
          },
        },
        CityUpdateInput: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            populacao: { type: 'integer' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            countryId: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    paths: {
      // ===== Continents =====
      '/api/continents': {
        get: {
          summary: 'Listar continentes',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          summary: 'Criar continente',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContinentCreateInput' } } },
          },
          responses: { 201: { description: 'Criado' } },
        },
      },
      '/api/continents/{id}': {
        get: {
          summary: 'Obter continente por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrado' } },
        },
        patch: { // ← PATCH para atualização parcial
          summary: 'Atualizar continente (parcial)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContinentUpdateInput' } } },
          },
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          summary: 'Excluir continente',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 204: { description: 'Sem conteúdo' } },
        },
      },

      // ===== Countries =====
      '/api/countries': {
        get: {
          summary: 'Listar países',
          parameters: [
            { name: 'continentId', in: 'query', schema: { type: 'string', format: 'uuid' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          summary: 'Criar país',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CountryCreateInput' } } },
          },
          responses: { 201: { description: 'Criado' } },
        },
      },
      '/api/countries/{id}': {
        get: {
          summary: 'Obter país por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrado' } },
        },
        patch: {
          summary: 'Atualizar país (parcial)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CountryUpdateInput' } } },
          },
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          summary: 'Excluir país',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 204: { description: 'Sem conteúdo' } },
        },
      },

      // ===== Cities =====
      '/api/cities': {
        get: {
          summary: 'Listar cidades',
          parameters: [
            { name: 'countryId', in: 'query', schema: { type: 'string', format: 'uuid' } },
            { name: 'continentId', in: 'query', schema: { type: 'string', format: 'uuid' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          summary: 'Criar cidade',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CityCreateInput' } } },
          },
          responses: { 201: { description: 'Criado' } },
        },
      },
      '/api/cities/{id}': {
        get: {
          summary: 'Obter cidade por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrado' } },
        },
        patch: {
          summary: 'Atualizar cidade (parcial)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CityUpdateInput' } } },
          },
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          summary: 'Excluir cidade',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 204: { description: 'Sem conteúdo' } },
        },
      },

      // ===== Integrations =====
      '/api/integrations/countries/enrich': {
        post: {
          summary: 'Enriquecer dados do país via REST Countries',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { type: 'object', required: ['nome'], properties: { nome: { type: 'string' } } } },
            },
          },
          responses: { 200: { description: 'OK' }, 404: { description: 'País não encontrado' } },
        },
      },
      '/api/integrations/weather': {
        get: {
          summary: 'Obter clima atual (OpenWeatherMap)',
          parameters: [
            { name: 'lat', in: 'query', required: true, schema: { type: 'number' } },
            { name: 'lon', in: 'query', required: true, schema: { type: 'number' } },
          ],
          responses: { 200: { description: 'OK' }, 400: { description: 'Parâmetros inválidos' } },
        },
      },
    },
  },
  apis: [],
})
