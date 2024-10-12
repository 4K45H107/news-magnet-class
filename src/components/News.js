import React, { Component } from "react";
import NewsItem from "./NewsItem";

export class News extends Component {
  articles = []

  constructor() {
    super();
    console.log("News component Constructor");
    this.state = { articles: this.articles, loading: false };
  }

  async componentDidMount() {
    console.log("cdm");
    let url =
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=e400277eec9d4a72ba10fb0a3eec8386";
    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({ articles: parsedData.articles });
  }

  render() {
    return (
      <div className="container my-3">
        <h2 className="">NewsMonkey - Top Headlines</h2>
        <div className="row">
          {this.state.articles.map((news) => {
            return (
              <div className="col-md-4" key={news.url}>
                <NewsItem
                  title={news.title ? news.title.slice(0, 45) : "News"}
                  description={
                    news.description ? news.description.slice(0, 88) : ""
                  }
                  imageUrl={news.urlToImage ? news.urlToImage : "logo512.png"}
                  newsUrl={news.url ? news.url : ""}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default News;
