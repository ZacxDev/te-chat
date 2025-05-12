load("./utils.star", "create_standard_route", "create_simple_route", "create_plush_partial", "create_component_partial", "create_component_partial_with_dir")

is_production_environment = True

global_render_context = {
}

# Basic site configuration
def get_origin():
    if is_production_environment:
        return "https://tradingeconomicsChat.com"
    return "http://localhost:9010"

def get_api_origin():
    if is_production_environment:
        return "https://api.tradingeconomicsChat.com"
    return "http://localhost:8110"

app_origin = get_origin()
api_origin = get_api_origin()

not_found_page_source = "templates/404.plush.html"
default_layout_source = "templates/layouts/base.plush.html"

# JavaScript targets
javascript_targets = {
    "index_page_app": js_target(
        source="src/entry/IndexPage.ts",
        out_dir="static"
    ),
}

# Routes definition
routes = [
    # Main pages
    create_standard_route("/", "pages/index/index.plush.html", javascript_deps=["index_page_app"]),
]

# Translations
translations = [
    translation(
        code="en",
        source="translations/en.yaml",
        source_type="YAML",
        is_default=True
    )
]

# Partials
partials = dict([
])
