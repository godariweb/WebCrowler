package com.data;

public class Page {
	
	private String id = "";
    private String websiteId = "";
    private String websiteName = "";
    private String pageUrl = "";
    private String pageTextContent = "";
	
    public Page(String id, String websiteId, String websiteName, String pageUrl, String pageTextContent) {		
    	this.id = id;
    	this.websiteId = websiteId;
    	this.websiteName = websiteName;
    	this.pageUrl = pageUrl;
    	this.pageTextContent = pageTextContent;
	}

	public String getId() {
		return id;
	}

	public String getWebsiteId() {
		return websiteId;
	}

	public String getWebsiteName() {
		return websiteName;
	}

	public String getPageUrl() {
		return pageUrl;
	}

	public String getPageTextContent() {
		return pageTextContent;
	}

	@Override
	public String toString() {
		return "Page [id=" + id + ", websiteId=" + websiteId + ", websiteName=" + websiteName + ", pageUrl=" + pageUrl
				+ ", pageTextContent=" + pageTextContent + "]";
	}
}