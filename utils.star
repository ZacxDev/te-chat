# Helper functions for manifest configuration

def create_standard_route(path, source, template_type="PLUSH", page_title="", static_render_data={}, sitemap_video_data={}, javascript_deps=[]):
    """Creates a route with standard dependencies for main pages"""
    return route(
        path=path,
        source=source,
        template_type=template_type,
        javascript_deps=javascript_deps,
        page_title=page_title,
        partial_deps=[
            "header",
            "footer",
        ],
        static_render_data=static_render_data,
        sitemap_video_data=sitemap_video_data,
    )

def create_simple_route(path, source, template_type="PLUSH", javascript_deps=[]):
    """Creates a route with minimal dependencies for simple pages"""
    return route(
        path=path,
        source=source,
        template_type=template_type,
        javascript_deps=javascript_deps,
        partial_deps=[
            "header",
            "footer",
        ]
    )

def create_plush_partial(name, template_path):
    """Helper to create a PLUSH partial with standard configuration"""
    return (name, partial(
        source="templates/partials/{}".format(template_path),
        template_type="PLUSH"
    ))

def create_component_partial(label, name):
    """Helper to create a component partial with standard path structure"""
    return (label, partial(
        source="templates/components/{}/{}.plush.html".format(name, name),
        template_type="PLUSH"
    ))

def create_component_partial_with_dir(label, name, subdir):
    """Helper to create a component partial with standard path structure"""
    return (label, partial(
        source="templates/components/{}/{}.plush.html".format(subdir, name),
        template_type="PLUSH"
    ))

