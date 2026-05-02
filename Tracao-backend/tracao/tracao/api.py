from ninja_extra import NinjaExtraAPI
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.controller import NinjaJWTDefaultController
from user.api import UserController
from stock.api import StockController
from tracability.api import TracabilityController

api = NinjaExtraAPI(auth=JWTAuth)

api.register_controllers(NinjaJWTDefaultController, UserController, StockController, TracabilityController)

