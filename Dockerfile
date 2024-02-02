ARG BDC_UI_TAG
FROM hms-dbmi/pic-sure-biodatacatalyst-ui:${BDC_UI_TAG}

# The build will fail if any directories are missing from the override UI
COPY ui/src/main/picsureui/ /usr/local/apache2/htdocs/picsureui/
COPY ui/src/main/psamaui/ /usr/local/apache2/htdocs/picsureui/psamaui/

# Add new Logo
COPY logo.png /usr/local/apache2/htdocs/picsureui/static/logo.png
COPY logo.png /usr/local/apache2/htdocs/images/logo.png
COPY logo.png /usr/local/apache2/htdocs/favicon.ico