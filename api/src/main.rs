#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use std::io::Cursor;
use rocket::response::{Response, Body};

/// Manipulate an image from a url with the given parameters, returns a buffer
#[get("/manipulate/<url>?<posterize>&<contrast>&<pixelate>")]
fn manipulate<'a>(url: String, posterize: f64, contrast: Option<f32>, pixelate: Option<f32>) -> Response<'a> {
    let img_raw = reqwest::blocking::get(&url).unwrap().bytes().unwrap();
    let image = image::load_from_memory(&img_raw).unwrap();

    // Apply our arguments
   // image.adjust_contrast(contrast.unwrap_or_else(|| 0.75));

    let mut response = Response::new();
    let body = Body::Chunked(Cursor::new(img_raw), 4);
    response.set_raw_body(body);
    return response;   
}

fn main() {
    rocket::ignite().mount("/api/", routes![manipulate]).launch();
}