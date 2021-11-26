var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@middy/core/index.js
var require_core = __commonJS({
  "node_modules/@middy/core/index.js"(exports, module2) {
    "use strict";
    var middy2 = (baseHandler = () => {
    }, plugin) => {
      var _plugin$beforePrefetc;
      plugin === null || plugin === void 0 ? void 0 : (_plugin$beforePrefetc = plugin.beforePrefetch) === null || _plugin$beforePrefetc === void 0 ? void 0 : _plugin$beforePrefetc.call(plugin);
      const beforeMiddlewares = [];
      const afterMiddlewares = [];
      const onErrorMiddlewares = [];
      const instance = (event = {}, context = {}) => {
        var _plugin$requestStart;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$requestStart = plugin.requestStart) === null || _plugin$requestStart === void 0 ? void 0 : _plugin$requestStart.call(plugin);
        const request = {
          event,
          context,
          response: void 0,
          error: void 0,
          internal: {}
        };
        return runRequest(request, [...beforeMiddlewares], baseHandler, [...afterMiddlewares], [...onErrorMiddlewares], plugin);
      };
      instance.use = (middlewares) => {
        if (Array.isArray(middlewares)) {
          for (const middleware of middlewares) {
            instance.applyMiddleware(middleware);
          }
          return instance;
        }
        return instance.applyMiddleware(middlewares);
      };
      instance.applyMiddleware = (middleware) => {
        const {
          before,
          after,
          onError
        } = middleware;
        if (!before && !after && !onError) {
          throw new Error('Middleware must be an object containing at least one key among "before", "after", "onError"');
        }
        if (before)
          instance.before(before);
        if (after)
          instance.after(after);
        if (onError)
          instance.onError(onError);
        return instance;
      };
      instance.before = (beforeMiddleware) => {
        beforeMiddlewares.push(beforeMiddleware);
        return instance;
      };
      instance.after = (afterMiddleware) => {
        afterMiddlewares.unshift(afterMiddleware);
        return instance;
      };
      instance.onError = (onErrorMiddleware) => {
        onErrorMiddlewares.push(onErrorMiddleware);
        return instance;
      };
      instance.__middlewares = {
        before: beforeMiddlewares,
        after: afterMiddlewares,
        onError: onErrorMiddlewares
      };
      return instance;
    };
    var runRequest = async (request, beforeMiddlewares, baseHandler, afterMiddlewares, onErrorMiddlewares, plugin) => {
      try {
        await runMiddlewares(request, beforeMiddlewares, plugin);
        if (request.response === void 0) {
          var _plugin$beforeHandler, _plugin$afterHandler;
          plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeHandler = plugin.beforeHandler) === null || _plugin$beforeHandler === void 0 ? void 0 : _plugin$beforeHandler.call(plugin);
          request.response = await baseHandler(request.event, request.context);
          plugin === null || plugin === void 0 ? void 0 : (_plugin$afterHandler = plugin.afterHandler) === null || _plugin$afterHandler === void 0 ? void 0 : _plugin$afterHandler.call(plugin);
          await runMiddlewares(request, afterMiddlewares, plugin);
        }
      } catch (e) {
        request.response = void 0;
        request.error = e;
        try {
          await runMiddlewares(request, onErrorMiddlewares, plugin);
        } catch (e2) {
          e2.originalError = request.error;
          request.error = e2;
          throw request.error;
        }
        if (request.response === void 0)
          throw request.error;
      } finally {
        var _plugin$requestEnd;
        await (plugin === null || plugin === void 0 ? void 0 : (_plugin$requestEnd = plugin.requestEnd) === null || _plugin$requestEnd === void 0 ? void 0 : _plugin$requestEnd.call(plugin, request));
      }
      return request.response;
    };
    var runMiddlewares = async (request, middlewares, plugin) => {
      for (const nextMiddleware of middlewares) {
        var _plugin$beforeMiddlew, _plugin$afterMiddlewa;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeMiddlew = plugin.beforeMiddleware) === null || _plugin$beforeMiddlew === void 0 ? void 0 : _plugin$beforeMiddlew.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        const res = await (nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware(request));
        plugin === null || plugin === void 0 ? void 0 : (_plugin$afterMiddlewa = plugin.afterMiddleware) === null || _plugin$afterMiddlewa === void 0 ? void 0 : _plugin$afterMiddlewa.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        if (res !== void 0) {
          request.response = res;
          return;
        }
      }
    };
    module2.exports = middy2;
  }
});

// node_modules/@middy/util/codes.json
var require_codes = __commonJS({
  "node_modules/@middy/util/codes.json"(exports, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/@middy/util/index.js
var require_util = __commonJS({
  "node_modules/@middy/util/index.js"(exports, module2) {
    "use strict";
    var {
      Agent
    } = require("https");
    var awsClientDefaultOptions = {
      httpOptions: {
        agent: new Agent({
          secureProtocol: "TLSv1_2_method"
        })
      }
    };
    var createPrefetchClient = (options) => {
      const awsClientOptions = __spreadValues(__spreadValues({}, awsClientDefaultOptions), options.awsClientOptions);
      const client = new options.AwsClient(awsClientOptions);
      if (options.awsClientCapture) {
        return options.awsClientCapture(client);
      }
      return client;
    };
    var createClient = async (options, request) => {
      let awsClientCredentials = {};
      if (options.awsClientAssumeRole) {
        if (!request)
          throw new Error("Request required when assuming role");
        awsClientCredentials = await getInternal({
          credentials: options.awsClientAssumeRole
        }, request);
      }
      awsClientCredentials = __spreadValues(__spreadValues({}, awsClientCredentials), options.awsClientOptions);
      return createPrefetchClient(__spreadProps(__spreadValues({}, options), {
        awsClientOptions: awsClientCredentials
      }));
    };
    var canPrefetch = (options) => {
      return !(options !== null && options !== void 0 && options.awsClientAssumeRole) && !(options !== null && options !== void 0 && options.disablePrefetch);
    };
    var getInternal = async (variables, request) => {
      if (!variables || !request)
        return {};
      let keys = [];
      let values = [];
      if (variables === true) {
        keys = values = Object.keys(request.internal);
      } else if (typeof variables === "string") {
        keys = values = [variables];
      } else if (Array.isArray(variables)) {
        keys = values = variables;
      } else if (typeof variables === "object") {
        keys = Object.keys(variables);
        values = Object.values(variables);
      }
      const promises = [];
      for (const internalKey of values) {
        var _valuePromise;
        const pathOptionKey = internalKey.split(".");
        const rootOptionKey = pathOptionKey.shift();
        let valuePromise = request.internal[rootOptionKey];
        if (typeof ((_valuePromise = valuePromise) === null || _valuePromise === void 0 ? void 0 : _valuePromise.then) !== "function") {
          valuePromise = Promise.resolve(valuePromise);
        }
        promises.push(valuePromise.then((value) => pathOptionKey.reduce((p, c) => p === null || p === void 0 ? void 0 : p[c], value)));
      }
      values = await Promise.allSettled(promises);
      const errors = values.filter((res) => res.status === "rejected").map((res) => res.reason.message);
      if (errors.length)
        throw new Error(JSON.stringify(errors));
      return keys.reduce((obj, key, index) => __spreadProps(__spreadValues({}, obj), {
        [sanitizeKey(key)]: values[index].value
      }), {});
    };
    var sanitizeKeyPrefixLeadingNumber = /^([0-9])/;
    var sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g;
    var sanitizeKey = (key) => {
      return key.replace(sanitizeKeyPrefixLeadingNumber, "_$1").replace(sanitizeKeyRemoveDisallowedChar, "_");
    };
    var cache = {};
    var processCache = (options, fetch = () => void 0, request) => {
      const {
        cacheExpiry,
        cacheKey
      } = options;
      if (cacheExpiry) {
        const cached = getCache(cacheKey);
        const unexpired = cached && (cacheExpiry < 0 || cached.expiry > Date.now());
        if (unexpired && cached.modified) {
          const value2 = fetch(request, cached.value);
          cache[cacheKey] = {
            value: __spreadValues(__spreadValues({}, cached.value), value2),
            expiry: cached.expiry
          };
          return cache[cacheKey];
        }
        if (unexpired) {
          return __spreadProps(__spreadValues({}, cached), {
            cache: true
          });
        }
      }
      const value = fetch(request);
      const expiry = Date.now() + cacheExpiry;
      if (cacheExpiry) {
        cache[cacheKey] = {
          value,
          expiry
        };
      }
      return {
        value,
        expiry
      };
    };
    var getCache = (key) => {
      return cache[key];
    };
    var modifyCache = (cacheKey, value) => {
      if (!cache[cacheKey])
        return;
      cache[cacheKey] = __spreadProps(__spreadValues({}, cache[cacheKey]), {
        value,
        modified: true
      });
    };
    var clearCache = (keys = null) => {
      var _keys;
      keys = (_keys = keys) !== null && _keys !== void 0 ? _keys : Object.keys(cache);
      if (!Array.isArray(keys))
        keys = [keys];
      for (const cacheKey of keys) {
        cache[cacheKey] = void 0;
      }
    };
    var jsonSafeParse = (string, reviver) => {
      if (typeof string !== "string")
        return string;
      const firstChar = string[0];
      if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"')
        return string;
      try {
        return JSON.parse(string, reviver);
      } catch (e) {
      }
      return string;
    };
    var normalizeHttpResponse = (response) => {
      var _response$headers, _response;
      if (response === void 0) {
        response = {};
      } else if (Array.isArray(response) || typeof response !== "object" || response === null) {
        response = {
          body: response
        };
      }
      response.headers = (_response$headers = (_response = response) === null || _response === void 0 ? void 0 : _response.headers) !== null && _response$headers !== void 0 ? _response$headers : {};
      return response;
    };
    var statuses = require_codes();
    var {
      inherits
    } = require("util");
    var createErrorRegexp = /[^a-zA-Z]/g;
    var createError = (code, message, properties = {}) => {
      const name = statuses[code].replace(createErrorRegexp, "");
      const className = name.substr(-5) !== "Error" ? name + "Error" : name;
      function HttpError(message2) {
        const msg = message2 !== null && message2 !== void 0 ? message2 : statuses[code];
        const err = new Error(msg);
        Error.captureStackTrace(err, HttpError);
        Object.setPrototypeOf(err, HttpError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(HttpError, Error);
      const desc = Object.getOwnPropertyDescriptor(HttpError, "name");
      desc.value = className;
      Object.defineProperty(HttpError, "name", desc);
      Object.assign(HttpError.prototype, {
        status: code,
        statusCode: code,
        expose: code < 500
      }, properties);
      return new HttpError(message);
    };
    module2.exports = {
      createPrefetchClient,
      createClient,
      canPrefetch,
      getInternal,
      sanitizeKey,
      processCache,
      getCache,
      modifyCache,
      clearCache,
      jsonSafeParse,
      normalizeHttpResponse,
      createError
    };
  }
});

// node_modules/@middy/http-json-body-parser/index.js
var require_http_json_body_parser = __commonJS({
  "node_modules/@middy/http-json-body-parser/index.js"(exports, module2) {
    "use strict";
    var mimePattern = /^application\/(.+\+)?json(;.*)?$/;
    var defaults = {
      reviver: void 0
    };
    var httpJsonBodyParserMiddleware = (opts = {}) => {
      const options = __spreadValues(__spreadValues({}, defaults), opts);
      const httpJsonBodyParserMiddlewareBefore = async (request) => {
        var _headers$ContentType;
        const {
          headers,
          body
        } = request.event;
        const contentTypeHeader = (_headers$ContentType = headers === null || headers === void 0 ? void 0 : headers["Content-Type"]) !== null && _headers$ContentType !== void 0 ? _headers$ContentType : headers === null || headers === void 0 ? void 0 : headers["content-type"];
        if (mimePattern.test(contentTypeHeader)) {
          try {
            const data = request.event.isBase64Encoded ? Buffer.from(body, "base64").toString() : body;
            request.event.rawBody = body;
            request.event.body = JSON.parse(data, options.reviver);
          } catch (err) {
            const {
              createError
            } = require_util();
            throw createError(422, "Content type defined as JSON but an invalid JSON was provided");
          }
        }
      };
      return {
        before: httpJsonBodyParserMiddlewareBefore
      };
    };
    module2.exports = httpJsonBodyParserMiddleware;
  }
});

// src/functions/hello/handler.ts
__export(exports, {
  main: () => main
});

// src/libs/apiGateway.ts
var formatJSONResponse = (response) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

// src/libs/lambda.ts
var import_core = __toModule(require_core());
var import_http_json_body_parser = __toModule(require_http_json_body_parser());
var middyfy = (handler) => {
  return (0, import_core.default)(handler).use((0, import_http_json_body_parser.default)());
};

// src/functions/hello/handler.ts
var AWS = __toModule(require("aws-sdk"));
var hello = async (event) => {
  let dynamo = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
    endpoint: "http://localhost:8000"
  });
  const data = await dynamo.delete({ TableName: "myTable", Key: { name: event.body.name } }).promise();
  console.log(data);
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event
  });
};
var main = middyfy(hello);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
//# sourceMappingURL=handler.js.map
