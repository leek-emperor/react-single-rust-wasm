use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, react-singe-rust-wasm!");
}

#[wasm_bindgen]
pub fn test(s: &str) -> String {
    return format!("Get {s} !");
}
