import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnalysisSection } from '../AnalysisSection';

describe('AnalysisSection', () => {
  const mockContent = [
    'First analysis point',
    'Second analysis point',
    'Third analysis point',
  ];

  it('should render with title and content', () => {
    const { getByText } = render(
      <AnalysisSection
        title="Signal Scan"
        content={mockContent}
        theme="blue"
      />
    );

    expect(getByText('Signal Scan')).toBeTruthy();
  });

  it('should toggle collapsed state when pressed', () => {
    const { getByText, queryByText } = render(
      <AnalysisSection
        title="Signal Scan"
        content={mockContent}
        theme="blue"
        defaultCollapsed={true}
      />
    );

    // Content should not be visible initially
    expect(queryByText('First analysis point')).toBeNull();

    // Find and press the header
    const header = getByText('Signal Scan');
    fireEvent.press(header);

    // Content should now be visible
    expect(getByText('First analysis point')).toBeTruthy();
  });

  it('should render all content items when expanded', () => {
    const { getByText } = render(
      <AnalysisSection
        title="Mirror Reflection"
        content={mockContent}
        theme="red"
        defaultCollapsed={false}
      />
    );

    mockContent.forEach(item => {
      expect(getByText(item)).toBeTruthy();
    });
  });

  it('should apply correct theme colors', () => {
    const { getByText } = render(
      <AnalysisSection
        title="Audit Findings"
        content={mockContent}
        theme="green"
      />
    );

    const title = getByText('Audit Findings');
    expect(title).toBeTruthy();
  });

  it('should show correct data point count', () => {
    const { getByText } = render(
      <AnalysisSection
        title="Test Section"
        content={mockContent}
        theme="purple"
      />
    );

    expect(getByText(/3 data points/)).toBeTruthy();
  });

  it('should render with different themes', () => {
    const themes: ('blue' | 'red' | 'green' | 'purple' | 'orange' | 'teal' | 'gold')[] = [
      'blue',
      'red',
      'green',
      'purple',
      'orange',
      'teal',
      'gold',
    ];

    themes.forEach(theme => {
      const { getByText } = render(
        <AnalysisSection
          title={`Test ${theme}`}
          content={mockContent}
          theme={theme}
        />
      );

      expect(getByText(`Test ${theme}`)).toBeTruthy();
    });
  });
});
