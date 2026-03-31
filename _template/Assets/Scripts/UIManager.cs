using UnityEngine;
using TMPro;
using UnityEngine.UI;

/// <summary>
/// UIManager — Template for your game UI.
///
/// TODO: Customize for your game's UI needs.
/// </summary>
public class UIManager : MonoBehaviour
{
    [Header("Panels")]
    public GameObject waitingPanel;
    public GameObject gameOverPanel;

    [Header("Waiting Panel")]
    public TextMeshProUGUI waitingText;
    public Button playAIButton;

    [Header("Game Over Panel")]
    public TextMeshProUGUI gameOverTitle;
    public TextMeshProUGUI scoreText;
    public Button playAgainButton;

    public void ShowWaiting()
    {
        waitingPanel?.SetActive(true);
        gameOverPanel?.SetActive(false);
    }

    public void HideWaiting()
    {
        waitingPanel?.SetActive(false);
    }

    public void ShowGameOver(string title, string score)
    {
        gameOverPanel?.SetActive(true);
        waitingPanel?.SetActive(false);

        if (gameOverTitle != null) gameOverTitle.text = title;
        if (scoreText != null) scoreText.text = score;
    }

    public void HideGameOver()
    {
        gameOverPanel?.SetActive(false);
    }

    // TODO: Add methods for your game-specific UI
    // public void UpdateScore(int left, int right) { ... }
    // public void ShowCountdown() { ... }
}
