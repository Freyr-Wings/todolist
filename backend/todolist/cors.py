# https://www.techiediaries.com/django-cors/
class CorsMiddleware(object):
    def process_response(self, req, resp):
        resp["Access-Control-Allow-Origin"] = "*"
        resp["Access-Control-Allow-Methods"] = "*"
        resp["Access-Control-Allow-Headers"] = "Accept, Content-Type"
        return resp