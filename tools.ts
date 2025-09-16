import { tool } from "ai";
import { simpleGit } from "simple-git";
import { z } from "zod";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const excludeFiles = ["dist", "bun.lock"];

const fileChange = z.object({
    rootDir: z.string().min(1).describe("The root directory"),
});

type FileChange = z.infer<typeof fileChange>;

async function getFileChangesInDirectory({ rootDir }: FileChange) {
    const git = simpleGit(rootDir);
    const summary = await git.diffSummary();
    const diffs: { file: string; diff: string }[] = [];

    for (const file of summary.files) {
        if (excludeFiles.includes(file.file)) continue;
        const diff = await git.diff(["--", file.file]);
        diffs.push({ file: file.file, diff });
    }

    return diffs;
}

export const getFileChangesInDirectoryTool = tool({
    description: "Gets the code changes made in given directory",
    inputSchema: fileChange,
    execute: getFileChangesInDirectory,
});

// Commit message generation tool
const commitMessageSchema = z.object({
    rootDir: z.string().min(1).describe("The root directory to analyze for commit message"),
    maxLength: z.number().optional().describe("Maximum length of commit message (default: 72)"),
});

type CommitMessageInput = z.infer<typeof commitMessageSchema>;

async function generateCommitMessage({ rootDir, maxLength = 72 }: CommitMessageInput) {
    const git = simpleGit(rootDir);
    const summary = await git.diffSummary();

    if (summary.files.length === 0) {
        return "No changes detected";
    }

    // Analyze the changes to generate a meaningful commit message
    const changedFiles = summary.files
        .filter(file => !excludeFiles.includes(file.file))
        .map(file => ({
            file: file.file,
            changes: 'changes' in file ? file.changes : 0,
            insertions: 'insertions' in file ? file.insertions : 0,
            deletions: 'deletions' in file ? file.deletions : 0
        }));

    // Categorize changes
    const newFiles = changedFiles.filter(f => f.insertions > 0 && f.deletions === 0);
    const deletedFiles = changedFiles.filter(f => f.insertions === 0 && f.deletions > 0);
    const modifiedFiles = changedFiles.filter(f => f.insertions > 0 && f.deletions > 0);

    let commitMessage = "";

    if (newFiles.length > 0) {
        commitMessage += `Add ${newFiles.length} new file${newFiles.length > 1 ? 's' : ''}`;
        if (newFiles.length <= 3) {
            commitMessage += `: ${newFiles.map(f => f.file).join(', ')}`;
        }
    } else if (deletedFiles.length > 0) {
        commitMessage += `Remove ${deletedFiles.length} file${deletedFiles.length > 1 ? 's' : ''}`;
        if (deletedFiles.length <= 3) {
            commitMessage += `: ${deletedFiles.map(f => f.file).join(', ')}`;
        }
    } else if (modifiedFiles.length > 0) {
        commitMessage += `Update ${modifiedFiles.length} file${modifiedFiles.length > 1 ? 's' : ''}`;
        if (modifiedFiles.length <= 3) {
            commitMessage += `: ${modifiedFiles.map(f => f.file).join(', ')}`;
        }
    }

    // Add summary of changes
    const totalInsertions = changedFiles.reduce((sum, f) => sum + f.insertions, 0);
    const totalDeletions = changedFiles.reduce((sum, f) => sum + f.deletions, 0);

    if (totalInsertions > 0 || totalDeletions > 0) {
        commitMessage += ` (+${totalInsertions} -${totalDeletions})`;
    }

    // Truncate if too long
    if (commitMessage.length > maxLength) {
        commitMessage = commitMessage.substring(0, maxLength - 3) + "...";
    }

    return commitMessage;
}

export const generateCommitMessageTool = tool({
    description: "Generates a commit message based on the changes in the given directory",
    inputSchema: commitMessageSchema,
    execute: generateCommitMessage,
});

// Markdown file writing tool
const markdownWriteSchema = z.object({
    content: z.string().min(1).describe("The markdown content to write"),
    filename: z.string().min(1).describe("The filename for the markdown file"),
    directory: z.string().optional().describe("The directory to write the file to (default: current directory)"),
});

type MarkdownWriteInput = z.infer<typeof markdownWriteSchema>;

async function writeMarkdownFile({ content, filename, directory = "." }: MarkdownWriteInput) {
    // Ensure the directory exists
    if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
    }

    // Ensure filename has .md extension
    const markdownFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    const filePath = join(directory, markdownFilename);

    // Add timestamp and header to the content
    const timestamp = new Date().toISOString();
    const header = `# Code Review Report\n\n*Generated on: ${timestamp}*\n\n---\n\n`;
    const fullContent = header + content;

    writeFileSync(filePath, fullContent, 'utf8');

    return {
        success: true,
        filePath: filePath,
        message: `Markdown file written successfully to ${filePath}`
    };
}

export const writeMarkdownFileTool = tool({
    description: "Writes content to a markdown file with proper formatting and timestamp",
    inputSchema: markdownWriteSchema,
    execute: writeMarkdownFile,
});