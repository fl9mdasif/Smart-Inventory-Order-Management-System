import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { productServices } from './service.product';

// ── Create ─────────────────────────────────────────────────────────────────────
const createProduct = catchAsync(async (req, res) => {
    const result = await productServices.createProduct(req.body);
    response.createSendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
});

// ── Get All (search + filter + paginate) ───────────────────────────────────────
const getAllProducts = catchAsync(async (req, res) => {
    const result = await productServices.getAllProducts(req.query);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products retrieved successfully',
        data: result,
    });
});

// ── Get Single ─────────────────────────────────────────────────────────────────
const getSingleProduct = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const result = await productServices.getSingleProduct(productId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: result,
    });
});

// ── Update ─────────────────────────────────────────────────────────────────────
const updateProduct = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const result = await productServices.updateProduct(productId, req.body);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product updated successfully',
        data: result,
    });
});

// ── Delete ─────────────────────────────────────────────────────────────────────
const deleteProduct = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const result = await productServices.deleteProduct(productId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
});


// ── Restock Queue ──────────────────────────────────────────────────────────────
// GET /api/products/restock-queue
const getRestockQueue = catchAsync(async (req, res) => {
    const result = await productServices.getRestockQueue();
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Restock queue retrieved (${result.length} product${result.length !== 1 ? 's' : ''} need restocking)`,
        data: result,
    });
});


// // ── Adjust Stock ───────────────────────────────────────────────────────────────
// // body: { delta: number }  (positive = restock, negative = deduct)
// const adjustStock = catchAsync(async (req, res) => {
//     const { productId } = req.params;
//     const { delta } = req.body;
//     const result = await productServices.adjustStock(productId, delta);
//     response.createSendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: `Stock adjusted by ${delta > 0 ? '+' : ''}${delta}. Current stock: ${result.stockQuantity}`,
//         data: result,
//     });
// });


// // PATCH /api/products/:productId/restock
// // body: { quantity: number }  — sets absolute stock level
// const restockProduct = catchAsync(async (req, res) => {
//     const { productId } = req.params;
//     const { quantity } = req.body;
//     const result = await productServices.restockProduct(productId, quantity);
//     response.createSendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: `Stock updated to ${result.stockQuantity}. Status: ${result.status}`,
//         data: result,
//     });
// });

// // DELETE /api/products/:productId/restock-queue
// // Dismiss product from the restock queue without restocking
// const dismissFromRestockQueue = catchAsync(async (req, res) => {
//     const { productId } = req.params;
//     const result = await productServices.dismissFromRestockQueue(productId);
//     response.createSendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Product dismissed from restock queue',
//         data: result,
//     });
// });

export const productControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getRestockQueue,
    //     adjustStock,
    //     restockProduct,
    //     dismissFromRestockQueue,
};
