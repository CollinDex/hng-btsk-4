import { create, update } from './path/to/your/controller/file';
import { Article } from './database';
import { myDataSource } from './database';
import { Request, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

// Mock the repository methods
const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
};

jest.mock('./database', () => ({
    Article: jest.fn(),
    myDataSource: {
        getRepository: jest.fn(() => mockRepository),
    },
}));

// Helper function to create mock request and response
const createMockRequestResponse = () => {
    const req = mock<Request>();
    const res = mock<Response>();

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return { req, res };
};

describe('Article Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should return 422 if required fields are missing', async () => {
            const { req, res } = createMockRequestResponse();
            req.body = { title: '', content: '', author: '' };

            await create(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                errors: expect.arrayContaining([
                    { field: 'title', message: 'Title is required' },
                    { field: 'author', message: 'Author is required' },
                    { field: 'content', message: 'Content is required' },
                ]),
            });
        });

        it('should return 422 if article with the same title exists', async () => {
            const { req, res } = createMockRequestResponse();
            req.body = { title: 'Test Title', content: 'Test Content', author: 'Test Author' };

            mockRepository.findOne.mockResolvedValueOnce({ title: 'Test Title' });

            await create(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                errors: [{ field: 'title', message: 'Article already exists' }],
            });
        });

        it('should create a new article and return 201', async () => {
            const { req, res } = createMockRequestResponse();
            req.body = { title: 'Test Title', content: 'Test Content', author: 'Test Author' };

            mockRepository.findOne.mockResolvedValueOnce(null);
            mockRepository.create.mockReturnValueOnce(req.body);
            mockRepository.save.mockResolvedValueOnce({ ...req.body, article_id: '1', createdAt: new Date(), updatedAt: new Date() });

            await create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Topic Created Successfully',
                data: {
                    article_id: '1',
                    title: 'Test Title',
                    content: 'Test Content',
                    author: 'Test Author',
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                },
                status_code: 201,
            });
        });
    });

    describe('update', () => {
        it('should return 404 if the article is not found', async () => {
            const { req, res } = createMockRequestResponse();
            req.params.id = '1';
            req.body = { title: 'Updated Title', content: 'Updated Content', author: 'Updated Author' };

            mockRepository.findOne.mockResolvedValueOnce(null);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Article not found',
                status_code: 404,
            });
        });

        it('should update the article and return 200', async () => {
            const { req, res } = createMockRequestResponse();
            req.params.id = '1';
            req.body = { title: 'Updated Title', content: 'Updated Content', author: 'Updated Author' };

            const existingArticle = {
                article_id: '1',
                title: 'Test Title',
                content: 'Test Content',
                author: 'Test Author',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValueOnce(existingArticle);
            mockRepository.save.mockResolvedValueOnce({ ...existingArticle, ...req.body, updatedAt: new Date() });

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Topic Updated Successfully',
                data: {
                    article_id: '1',
                    title: 'Updated Title',
                    content: 'Updated Content',
                    author: 'Updated Author',
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                },
                status_code: 200,
            });
        });
    });
});
