using UnityEditor;
using UnityEngine;

/// <summary>
/// WebGLBuilder — Automated WebGL build for Ping Games.
///
/// Menu: Ping Games > Build WebGL
///
/// Outputs to the Build/ directory in the project root.
/// Settings: no compression, no exceptions, no splash screen.
/// </summary>
public class WebGLBuilder
{
    [MenuItem("Ping Games/Build WebGL")]
    public static void BuildWebGL()
    {
        // Ensure WebGL settings
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
        PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.None;
        PlayerSettings.WebGL.template = "PROJECT:PingMinimal";
        PlayerSettings.SplashScreen.show = false;

        string buildPath = "Build";
        string[] scenes = new string[EditorBuildSettings.scenes.Length];
        for (int i = 0; i < scenes.Length; i++)
        {
            scenes[i] = EditorBuildSettings.scenes[i].path;
        }

        if (scenes.Length == 0)
        {
            Debug.LogError("[WebGLBuilder] No scenes in Build Settings! Add your scene first.");
            return;
        }

        Debug.Log($"[WebGLBuilder] Building WebGL to {buildPath}...");
        var report = BuildPipeline.BuildPlayer(scenes, buildPath, BuildTarget.WebGL, BuildOptions.None);

        if (report.summary.result == UnityEditor.Build.Reporting.BuildResult.Succeeded)
        {
            Debug.Log($"[WebGLBuilder] Build succeeded! Output: {buildPath}/");
        }
        else
        {
            Debug.LogError($"[WebGLBuilder] Build failed: {report.summary.result}");
        }
    }
}
