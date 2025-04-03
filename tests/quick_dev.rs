#![allow(unused)]

use anyhow::Result;

#[tokio::test]
async fn quick_dev() -> Result<()> {
    let hc = httpc_test::new_client("http://localhost:8080")?;
    println!("testing hello route");

    // This will make the request and print the response details
    hc.do_get("/hello").await?.print().await?;

    Ok(())
}
