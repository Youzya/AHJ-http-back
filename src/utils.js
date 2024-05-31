const { v4, validate } = require('uuid');

class HttpError extends Error {
  constructor(status, message) {
    super(message);

    this.status = status;
  }
}

const generateUuid = v4;

function isValidUuid(id) { return typeof id === 'string' && validate(id); }

const ticketKeys = ['name', 'description', 'status'];

function parseTicket(body) {
  if (typeof body !== 'object') {
    throw new HttpError(400, 'Ticket object was not provided');
  }

  for (const key of ticketKeys) {
//	console.log('SERVER  ===key ',key,'  ===body',body,'  ===',!(key in body),'  ',(typeof body[key]),'  ',body[key].length);
//    console.log('SERVER  ===key ',key,' ===',(typeof key),'  ===',(body.hasOwnProperty(key)),'  ===',!(key in body),'  ===',body);
    if (!(body.hasOwnProperty(key)) || (typeof body[key] !== 'string') || (body[key].length === 0)) {
//	  console.log('SERVER  ===key ',key,'  ===body',body,'  ===',(body.hasOwnProperty(key)),'  ',(typeof body[key]),'  ',body[key].length);
      throw new HttpError(400, `Property "${key}" is not provided`);
    }
  }
  const { name, description, status } = body;

  if (status !== 'false' && status !== 'true') {
    throw new HttpError(400, 'Property "status" cannot be parsed as boolean');
  }

  if (typeof name !== 'string') {
    throw new HttpError('');
  }

  return {
    name,
    description,
    status: status === 'true',

  };
}

function checkHandlerMethod(handler, currMethod, expectedMethod) {
  if (currMethod !== expectedMethod) {
    throw new HttpError(404, `Method "${handler}" must have type ${expectedMethod} request method, but ${currMethod} was Provided`);
  }
}

module.exports = {
  HttpError,
  isValidUuid,
  generateUuid,
  checkHandlerMethod,
  parseTicket,
};
