"use strict";
const ProductService = require("../service/product.service");
const { SuccessResponse } = require("../core/success.response");
class ProductController {
  static createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list draft success",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list publish success",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product success",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish product success",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list products success",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  static findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list products success",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  static findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product success",
      metadata: await ProductService.findProduct(req.params),
    }).send(res);
  };

  static updateProduct = async (req, res, next) => {
    console.log("update >>>", req.body)
    new SuccessResponse({
      message: "Update product success",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = ProductController;
