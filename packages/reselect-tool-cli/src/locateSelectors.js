'use strict';
const { Project } = require('ts-morph');

const locateSelectors = (srcPattern, tsConfigFilePath) => {
    const project = new Project({
        tsConfigFilePath
    });
    const sourceFiles = project.getSourceFiles(srcPattern);
    const sourceFilesPathsWithReselect = [];

    sourceFiles.forEach((sourceFile) => {
        const importDeclaration = sourceFile.getImportDeclaration("reselect");

        if(importDeclaration) {
            const sourceFilePath = importDeclaration.getSourceFile().getFilePath();
            sourceFilesPathsWithReselect.push(sourceFilePath);
        }

    });

    return sourceFilesPathsWithReselect;
};

module.exports = {
    locateSelectors
};