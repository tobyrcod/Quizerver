/* eslint-disable no-use-before-define */
// Disabled this rule of eslint because require was being flagged despite
// not being an issue, and adding the env for supertest in the package.json
// file didn't work as supertest could not be found

// Written Following a tutorial on JEST and Supertest
// Tutorial from https://www.youtube.com/watch?v=FKnzS_icp20

'use strict';

const request = require('supertest');
const app = require('./app.js');

describe('GET /get-genres', () => {
  // should respond with a 200 status code
  test('should respond with a 200 status code', async () => {
    const responce = await request(app).get('/get-genres');
    expect(responce.statusCode).toBe(200);
  });

  // should specify json as the return type
  test('should specify json as the content type', async () => {
    const responce = await request(app).get('/get-genres');
    expect(responce.headers['content-type'])
      .toEqual(expect.stringContaining('json'));
  });

  // should be an array
  test('should be an array', async () => {
    const responce = await request(app).get('/get-genres');
    expect(Array.isArray(responce.body)).toEqual(true);
  });

  // the elements of the array should have an id and text property
  test('elements of array should have properties id and text', async () => {
    const responce = await request(app).get('/get-genres');
    const genres = responce.body;
    genres.forEach(genre => {
      expect(genre.id)
      .toBeDefined();
      expect(genre.text)
      .toBeDefined();
    });
  });
});

describe('GET /get-authors', () => {
  // should respond with a 200 status code
  test('should respond with a 200 status code', async () => {
    const responce = await request(app).get('/get-authors');
    expect(responce.statusCode).toBe(200);
  });

  // should specify json as the return type
  test('should specify json as the content type', async () => {
    const responce = await request(app).get('/get-authors');
    expect(responce.headers['content-type'])
      .toEqual(expect.stringContaining('json'));
  });

  // should be an array
  test('should be an array', async () => {
    const responce = await request(app).get('/get-authors');
    expect(Array.isArray(responce.body)).toEqual(true);
  });

  // the elements of the array should have an author_id and name property
  test('elements of array should have properties author_id and name', async () => {
    const responce = await request(app).get('/get-authors');
    const authors = responce.body;
    authors.forEach(author => {
      expect(author.author_id)
      .toBeDefined();
      expect(author.name)
      .toBeDefined();
    });
  });
});

describe('GET /get-question-sorts', () => {
  // should respond with a 200 status code
  test('should respond with a 200 status code', async () => {
    const responce = await request(app).get('/get-question-sorts');
    expect(responce.statusCode).toBe(200);
  });

  // should specify json as the return type
  test('should specify json as the content type', async () => {
    const responce = await request(app).get('/get-question-sorts');
    expect(responce.headers['content-type'])
      .toEqual(expect.stringContaining('json'));
  });

  // should be an array
  test('should be an array', async () => {
    const responce = await request(app).get('/get-question-sorts');
    expect(Array.isArray(responce.body)).toEqual(true);
  });

  // the elements of the array should have an id and text property
  test('elements of array should have properties id and text', async () => {
    const responce = await request(app).get('/get-question-sorts');
    const questionSorts = responce.body;
    questionSorts.forEach(sort => {
      expect(sort.id)
      .toBeDefined();
      expect(sort.text)
      .toBeDefined();
    });
  });
});

describe('GET /get-author-sorts', () => {
  // should respond with a 200 status code
  test('should respond with a 200 status code', async () => {
    const responce = await request(app).get('/get-author-sorts');
    expect(responce.statusCode).toBe(200);
  });

  // should specify json as the return type
  test('should specify json as the content type', async () => {
    const responce = await request(app).get('/get-author-sorts');
    expect(responce.headers['content-type'])
      .toEqual(expect.stringContaining('json'));
  });

  // should be an array
  test('should be an array', async () => {
    const responce = await request(app).get('/get-author-sorts');
    expect(Array.isArray(responce.body)).toEqual(true);
  });

  // the elements of the array should have an id and text property
  test('elements of array should have properties author_id and name', async () => {
    const responce = await request(app).get('/get-author-sorts');
    const questionSorts = responce.body;
    questionSorts.forEach(sort => {
      expect(sort.id)
      .toBeDefined();
      expect(sort.text)
      .toBeDefined();
    });
  });
});

describe('GET /get-question-info-set', () => {
  describe('given a valid query', () => {
    const query = {
      authorId: 'all',
      genre: 'all',
      sort: 'alpha',
      order: 'asc'
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .get('/get-question-info-set/?' +
          `authorId=${query.authorId}&` +
          `genre=${query.genre}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      expect(responce.statusCode).toBe(200);
    });

    // should specify json as the return type
    test('should specify json as the content type', async () => {
      const responce = await request(app)
        .get('/get-question-info-set/?' +
          `authorId=${query.authorId}&` +
          `genre=${query.genre}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      expect(responce.headers['content-type'])
        .toEqual(expect.stringContaining('json'));
    });

    // should be an array
    test('should be an array', async () => {
      const responce = await request(app)
        .get('/get-question-info-set/?' +
          `authorId=${query.authorId}&` +
          `genre=${query.genre}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      expect(Array.isArray(responce.body)).toEqual(true);
    });

    // the elements of the array should have all the info needed by a questionInfo
    test('elements of array should have the properties of a QuestionInfo', async () => {
      const responce = await request(app)
        .get('/get-question-info-set/?' +
          `authorId=${query.authorId}&` +
          `genre=${query.genre}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      const questionInfoSet = responce.body;
      questionInfoSet.forEach(questionInfo => {
        expect(questionInfo.answer)
        .toBeDefined();
        expect(questionInfo.authorName)
        .toBeDefined();
        expect(questionInfo.genre)
        .toBeDefined();
        expect(questionInfo.question)
        .toBeDefined();
        expect(questionInfo.question_id)
        .toBeDefined();
        expect(questionInfo.rating)
        .toBeDefined();
        expect(questionInfo.rating.likes)
        .toBeDefined();
        expect(questionInfo.rating.dislikes)
        .toBeDefined();
      });
    });
  });

  describe('given an invalid query', () => {
    describe('with no authorId', () => {
      const query = {
        genre: 'all',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
          expect(jsonResponce.message)
            .toBeDefined();
      });
    });
    describe('with an invalid authorId that is not a number', () => {
      const query = {
        authorId: 'invalid',
        genre: 'all',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid authorId that is not an integer', () => {
      const query = {
        authorId: '1.2',
        genre: 'all',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid authorId that is not a positive integer', () => {
      const query = {
        authorId: '-1.2',
        genre: 'all',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with no genre', () => {
      const query = {
        authorId: 'all',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid genre', () => {
      const query = {
        authorId: 'all',
        genre: 'invalid',
        sort: 'alpha',
        order: 'asc'
      };

      // should respond with a 200 status code
      test('should respond with a 200 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(200);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an array
      test('should return an array', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(Array.isArray(responce.body)).toEqual(true);
      });

      // should return an array of length 0
      test('should return an array of 0 questions', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const questions = responce.body;
        expect(questions.length).toEqual(0);
      });
    });
    describe('with no sort', () => {
      const query = {
        authorId: 'all',
        genre: 'all',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid sort', () => {
      const query = {
        authorId: 'all',
        genre: 'all',
        sort: 'invalid',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with no order', () => {
      const query = {
        authorId: 'all',
        genre: 'all',
        sort: 'alpha'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid order', () => {
      const query = {
        authorId: 'all',
        genre: 'all',
        sort: 'alpha',
        order: 'invalid'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-info-set/?' +
            `authorId=${query.authorId}&` +
            `genre=${query.genre}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
  });
});

describe('GET /get-author-info-set', () => {
  describe('given a valid query', () => {
    const query = {
      authorId: 'all',
      sort: 'alpha',
      order: 'asc'
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .get('/get-author-info-set/?' +
          `authorId=${query.authorId}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      expect(responce.statusCode).toBe(200);
    });

    // should specify json as the return type
    test('should specify json as the content type', async () => {
      const responce = await request(app)
        .get('/get-author-info-set/?' +
          `authorId=${query.authorId}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      expect(responce.headers['content-type'])
        .toEqual(expect.stringContaining('json'));
    });

    // should be an array
    test('should be an array', async () => {
      const responce = await request(app)
        .get('/get-author-info-set/?' +
          `authorId=${query.authorId}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      expect(Array.isArray(responce.body)).toEqual(true);
    });

    // the elements of the array should have all the info needed by a questionInfo
    test('elements of array should have the properties of a AuthorInfo', async () => {
      const responce = await request(app)
        .get('/get-author-info-set/?' +
          `authorId=${query.authorId}&` +
          `sort=${query.sort}&` +
          `order=${query.order}`
        );
      const authorInfoSet = responce.body;
      authorInfoSet.forEach(authorInfo => {
        expect(authorInfo.author_id)
          .toBeDefined();
        expect(authorInfo.name)
          .toBeDefined();
        expect(authorInfo.question_count)
          .toBeDefined();
        expect(authorInfo.favourite_genre)
          .toBeDefined();
        expect(authorInfo.author_score)
          .toBeDefined();
      });
    });
  });

  describe('given an invalid query', () => {
    describe('with no authorId', () => {
      const query = {
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid authorId that is not a number', () => {
      const query = {
        authorId: 'invalid',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // sshould return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid authorId that is not an integer', () => {
      const query = {
        authorId: '1.2',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // sshould return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid authorId that is not a positive integer', () => {
      const query = {
        authorId: '-1.2',
        sort: 'alpha',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // sshould return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with no sort', () => {
      const query = {
        authorId: 'all',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid sort', () => {
      const query = {
        authorId: 'all',
        sort: 'invalid',
        order: 'asc'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with no order', () => {
      const query = {
        authorId: 'all',
        sort: 'alpha'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid order', () => {
      const query = {
        authorId: 'all',
        sort: 'alpha',
        order: 'invalid'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the content type
      test('should specify json as the content type', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-author-info-set/?' +
            `authorId=${query.authorId}&` +
            `sort=${query.sort}&` +
            `order=${query.order}`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
  });
});

describe('GET /get-question-id-set', () => {
  describe('given a valid query', () => {
    const query = {
      count: 10,
      genre: 'all'
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .get('/get-question-id-set/?' +
          `count=${query.count}&` +
          `genre=${query.genre}&`
        );
      expect(responce.statusCode).toBe(200);
    });

    // should specify json as the return type
    test('should specify json as the return type', async () => {
      const responce = await request(app)
        .get('/get-question-id-set/?' +
          `count=${query.count}&` +
          `genre=${query.genre}&`
        );
      expect(responce.headers['content-type'])
        .toEqual(expect.stringContaining('json'));
    });

    // should be an array
    test('should be an array', async () => {
      const responce = await request(app)
        .get('/get-question-id-set/?' +
          `count=${query.count}&` +
          `genre=${query.genre}&`
        );
      expect(Array.isArray(responce.body)).toEqual(true);
    });

    // the elements of the array should have all be a number
    test('elements of the array should have all be an integer', async () => {
      const responce = await request(app)
        .get('/get-question-id-set/?' +
          `count=${query.count}&` +
          `genre=${query.genre}&`
        );
      const questionIdSet = responce.body;
      questionIdSet.forEach(questionId => {
        expect(Number.isInteger(questionId))
        .toBe(true);
      });
    });
  });

  describe('given an invalid query', () => {
    describe('with no genre', () => {
      const query = {
        count: 10
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an invalid genre', () => {
      const query = {
        count: 10,
        genre: 'invalid'
      };
      // should respond with a 200 status code
      test('should respond with a 200 status code', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.statusCode).toBe(200);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should be an array
      test('should be an array', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(Array.isArray(responce.body)).toEqual(true);
      });

      // should be an array of length 0
      test('should be an array of length 0', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        const questionIdSet = responce.body;
        expect(questionIdSet.length).toEqual(0);
      });
    });
    describe('with no count', () => {
      const query = {
        genre: 'all'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `genre=${query.genre}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `genre=${query.genre}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `genre=${query.genre}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with a count that is not a number', () => {
      const query = {
        count: 'invalid',
        genre: 'all'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with a count that is not an integer', () => {
      const query = {
        count: 1.2,
        genre: 'all'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with a count that is not a positive integer', () => {
      const query = {
        count: -3,
        genre: 'all'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get('/get-question-id-set/?' +
            `count=${query.count}&` +
            `genre=${query.genre}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
  });
});

describe('GET /qfqid/:id', () => {
  describe('given a valid query', () => {
    const query = {
      id: 0
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .get(`/qfqid/${query.id}`);
      expect(responce.statusCode).toBe(200);
    });

    // should specify json as the return type
    test('should specify json as the return type', async () => {
      const responce = await request(app)
        .get(`/qfqid/${query.id}`);
      expect(responce.headers['content-type'])
        .toEqual(expect.stringContaining('json'));
    });

    // should be a question Info
    test('should be a question info', async () => {
      const responce = await request(app)
        .get(`/qfqid/${query.id}`);
      const questionInfo = responce.body;
      expect(questionInfo.answer)
        .toBeDefined();
      expect(questionInfo.authorName)
        .toBeDefined();
      expect(questionInfo.genre)
        .toBeDefined();
      expect(questionInfo.question)
        .toBeDefined();
      expect(questionInfo.question_id)
        .toBeDefined();
      expect(questionInfo.rating)
        .toBeDefined();
      expect(questionInfo.rating.likes)
        .toBeDefined();
      expect(questionInfo.rating.dislikes)
        .toBeDefined();
    });
  });

  describe('given an invalid query', () => {
    describe('with no id', () => {
      // should respond with a 404 status code
      test('should respond with a 404 status code', async () => {
        const responce = await request(app)
          .get('/qfqid/');
        expect(responce.statusCode).toBe(404);
      });

      // should specify html as the return type
      test('should specify html as the return type', async () => {
        const responce = await request(app)
          .get('/qfqid/');
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('html'));
      });
    });
    describe('with an id that is not a number', () => {
      const query = {
        id: 'invalid'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not an integer', () => {
      const query = {
        id: 5.245
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not a positive integer', () => {
      const query = {
        id: -1
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get(`/qfqid/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
  });
});

describe('GET /afqid/:id', () => {
  describe('given a valid query', () => {
    const query = {
      id: 0
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .get(`/afqid/${query.id}`);
      expect(responce.statusCode).toBe(200);
    });

    // should specify json as the return type
    test('should specify json as the return type', async () => {
      const responce = await request(app)
        .get(`/afqid/${query.id}`);
      expect(responce.headers['content-type'])
        .toEqual(expect.stringContaining('json'));
    });

    // should be an author info
    test('should be an author info', async () => {
      const responce = await request(app)
        .get(`/afqid/${query.id}`);
      const authorInfo = responce.body;
      expect(authorInfo.author_id)
        .toBeDefined();
      expect(authorInfo.author_score)
        .toBeDefined();
      expect(authorInfo.favourite_genre)
        .toBeDefined();
      expect(authorInfo.name)
        .toBeDefined();
      expect(authorInfo.question_count)
        .toBeDefined();
    });
  });

  describe('given an invalid query', () => {
    describe('with no id', () => {
      // should respond with a 404 status code
      test('should respond with a 404 status code', async () => {
        const responce = await request(app)
          .get('/afqid/');
        expect(responce.statusCode).toBe(404);
      });

      // should specify html as the return type
      test('should specify html as the return type', async () => {
        const responce = await request(app)
          .get('/afqid/');
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('html'));
      });
    });
    describe('with an id that is not a number', () => {
      const query = {
        id: 'invalid'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not an integer', () => {
      const query = {
        id: 5.245
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not a positive integer', () => {
      const query = {
        id: -1
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .get(`/afqid/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
  });
});

describe('POST /upvote/:id', () => {
  describe('given a valid query', () => {
    const query = {
      id: 0
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .post(`/upvote/${query.id}`);
      expect(responce.statusCode).toBe(200);
    });

    // should specify json as the return type
    test('should specify json as the return type', async () => {
      const responce = await request(app)
        .post(`/upvote/${query.id}`);
      expect(responce.headers['content-type'])
        .toEqual(expect.stringContaining('json'));
    });

    // should have a new likes value
    test('should have a new likes value', async () => {
      const responce = await request(app)
        .post(`/upvote/${query.id}`);
      const jsonResponce = responce.body;
      expect(jsonResponce.likes)
        .toBeDefined();
    });

    // should be an integer likes value
    test('should be an integer likes value', async () => {
      const responce = await request(app)
        .post(`/upvote/${query.id}`);
      const jsonResponce = responce.body;
      expect(Number.isInteger(jsonResponce.likes)).toBe(true);
    });
  });

  describe('given an invalid query', () => {
    describe('with no id', () => {
      // should respond with a 404 status code
      test('should respond with a 404 status code', async () => {
        const responce = await request(app)
          .post('/upvote/');
        expect(responce.statusCode).toBe(404);
      });

      // should specify html as the return type
      test('should specify html as the return type', async () => {
        const responce = await request(app)
          .post('/upvote/');
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('html'));
      });
    });
    describe('with an id that is not a number', () => {
      const query = {
        id: 'invalid'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not an integer', () => {
      const query = {
        id: 5.245
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not a positive integer', () => {
      const query = {
        id: -1
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post(`/upvote/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
  });
});

describe('POST /downvote/:id', () => {
  describe('given a valid query', () => {
    const query = {
      id: 0
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .post(`/downvote/${query.id}`);
      expect(responce.statusCode).toBe(200);
    });

    // should specify json as the return type
    test('should specify json as the return type', async () => {
      const responce = await request(app)
        .post(`/downvote/${query.id}`);
      expect(responce.headers['content-type'])
        .toEqual(expect.stringContaining('json'));
    });

    // should have a new dislikes value
    test('should have a new dislikes value', async () => {
      const responce = await request(app)
        .post(`/downvote/${query.id}`);
      const jsonResponce = responce.body;
      expect(jsonResponce.dislikes)
        .toBeDefined();
    });

    // should be an integer dislikes value
    test('should be an integer dislikes value', async () => {
      const responce = await request(app)
        .post(`/downvote/${query.id}`);
      const jsonResponce = responce.body;
      expect(Number.isInteger(jsonResponce.dislikes)).toBe(true);
    });
  });

  describe('given an invalid query', () => {
    describe('with no id', () => {
      // should respond with a 404 status code
      test('should respond with a 404 status code', async () => {
        const responce = await request(app)
          .post('/downvote/');
        expect(responce.statusCode).toBe(404);
      });

      // should specify html as the return type
      test('should specify html as the return type', async () => {
        const responce = await request(app)
          .post('/downvote/');
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('html'));
      });
    });
    describe('with an id that is not a number', () => {
      const query = {
        id: 'invalid'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not an integer', () => {
      const query = {
        id: 5.245
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with an id that is not a positive integer', () => {
      const query = {
        id: -1
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post(`/downvote/${query.id}`);
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
  });
});

describe('POST /add-question', () => {
  describe('given a valid query', () => {
    const rand1 = Math.floor(Math.random() * 1000);
    const rand2 = Math.floor(Math.random() * 1000);
    const query = {
      question: `What is ${rand1} plus ${rand2}?`,
      answer: `${rand1 + rand2}`,
      genre: 'math',
      authorName: 'jest'
    };
    // should respond with a 200 status code
    test('should respond with a 200 status code', async () => {
      const responce = await request(app)
        .post('/add-question/?' +
          `question=${query.question}&` +
          `answer=${query.answer}&` +
          `genre=${query.genre}&` +
          `authorName=${query.authorName}&`
        );
      expect(responce.statusCode).toBe(200);
    });

    // There is no content type for a valid add-question,
    // just the 200 code to acknowledge it was succesfully added
  });

  describe('given an invalid query', () => {
    describe('with no question', () => {
      const rand1 = Math.floor(Math.random() * 1000);
      const rand2 = Math.floor(Math.random() * 1000);
      const query = {
        question: `What is ${rand1} plus ${rand2}?`,
        answer: `${rand1 + rand2}`,
        genre: 'math',
        authorName: 'jest'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `answer=${query.answer}&` +
            `genre=${query.genre}&` +
            `authorName=${query.authorName}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `answer=${query.answer}&` +
            `genre=${query.genre}&` +
            `authorName=${query.authorName}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `answer=${query.answer}&` +
            `genre=${query.genre}&` +
            `authorName=${query.authorName}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with no answer', () => {
      const rand1 = Math.floor(Math.random() * 1000);
      const rand2 = Math.floor(Math.random() * 1000);
      const query = {
        question: `What is ${rand1} plus ${rand2}?`,
        genre: 'math',
        authorName: 'jest'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `question=${query.question}&` +
            `genre=${query.genre}&` +
            `authorName=${query.authorName}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `question=${query.question}&` +
            `genre=${query.genre}&` +
            `authorName=${query.authorName}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `question=${query.question}&` +
            `genre=${query.genre}&` +
            `authorName=${query.authorName}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with no genre', () => {
      const rand1 = Math.floor(Math.random() * 1000);
      const rand2 = Math.floor(Math.random() * 1000);
      const query = {
        question: `What is ${rand1} plus ${rand2}?`,
        answer: `${rand1 + rand2}`,
        authorName: 'jest'
      };
      // should respond with a 400 status code
      test('should respond with a 400 status code', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `question=${query.question}&` +
            `answer=${query.answer}&` +
            `authorName=${query.authorName}&`
          );
        expect(responce.statusCode).toBe(400);
      });

      // should specify json as the return type
      test('should specify json as the return type', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `question=${query.question}&` +
            `answer=${query.answer}&` +
            `authorName=${query.authorName}&`
          );
        expect(responce.headers['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      // should return an error message
      test('should return an error message', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `question=${query.question}&` +
            `answer=${query.answer}&` +
            `authorName=${query.authorName}&`
          );
        const jsonResponce = responce.body;
        expect(jsonResponce.message)
          .toBeDefined();
      });
    });
    describe('with no author name', () => {
      const rand1 = Math.floor(Math.random() * 1000);
      const rand2 = Math.floor(Math.random() * 1000);
      const query = {
        question: `What is ${rand1} plus ${rand2}?`,
        answer: `${rand1 + rand2}`,
        genre: 'math'
      };
      // should respond with a 200 status code
      test('should respond with a 200 status code', async () => {
        const responce = await request(app)
          .post('/add-question/?' +
            `question=${query.question}&` +
            `answer=${query.answer}&` +
            `genre=${query.genre}&`
          );
        expect(responce.statusCode).toBe(200);
      });

      // If no author is provided, the server will use a default one
      // so from here we behave the same as the succesfull query

      // There is no content type for a valid add-question,
      // just the 200 code to acknowledge it was succesfully added
    });
  });
});

describe('USE /any-random-url-to-trigger-a-404', () => {
  // should respond with a 404 status code
  test('should respond with a 404 status code', async () => {
    const responce = await request(app)
      .get('/any-random-url-to-trigger-a-404');
    expect(responce.statusCode).toBe(404);
  });

  // should specify html as the return type
  test('should specify html as the return type', async () => {
    const responce = await request(app)
      .get('/qfqid/');
    expect(responce.headers['content-type'])
      .toEqual(expect.stringContaining('html'));
  });
});
