ARG BDC_UI_TAG
FROM biodatacatalyst_ui:${BDC_UI_TAG}

# The build will fail if any directories are missing from the override UI
COPY ui/src/main/picsureui/ /usr/local/apache2/htdocs/picsureui/
COPY ui/src/main/psamaui/ /usr/local/apache2/htdocs/picsureui/psamaui/