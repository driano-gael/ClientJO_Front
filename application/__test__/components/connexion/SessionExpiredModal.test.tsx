import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';

describe('SessionExpiredModal', () => {
  const mockOnClose = jest.fn();
  const mockOnReconnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('ne s\'affiche pas quand isOpen est false', () => {
    const { container } = render(
      <SessionExpiredModal
        isOpen={false}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('affiche le modal quand isOpen est true', () => {
    render(
      <SessionExpiredModal
        isOpen={true}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    expect(screen.getByText('Session expirée')).toBeInTheDocument();
  });

  it('affiche le compte à rebours initial de 10 secondes', () => {
    render(
      <SessionExpiredModal
        isOpen={true}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    // Utiliser getAllByText et prendre le premier élément (le <p>)
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('10 secondes') || false;
    });
    expect(elements[0]).toBeInTheDocument();
  });

  it('décrémente le compte à rebours chaque seconde', () => {
    render(
      <SessionExpiredModal
        isOpen={true}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    let elements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('10 secondes') || false;
    });
    expect(elements[0]).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    elements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('9 secondes') || false;
    });
    expect(elements[0]).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    elements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('8 secondes') || false;
    });
    expect(elements[0]).toBeInTheDocument();
  });

  it('appelle onReconnect quand le compte à rebours atteint 0', () => {
    render(
      <SessionExpiredModal
        isOpen={true}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockOnReconnect).toHaveBeenCalled();
  });

  it('appelle onClose quand on clique sur Fermer', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <SessionExpiredModal
        isOpen={true}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    const closeButton = screen.getByText('Fermer');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('appelle onReconnect quand on clique sur Se reconnecter maintenant', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <SessionExpiredModal
        isOpen={true}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    const reconnectButton = screen.getByText('Se reconnecter maintenant');
    await user.click(reconnectButton);

    expect(mockOnReconnect).toHaveBeenCalled();
  });

  it('réinitialise le compte à rebours quand le modal se ferme puis se rouvre', () => {
    const { rerender } = render(
      <SessionExpiredModal
        isOpen={true}
        onClose={mockOnClose}
        onReconnect={mockOnReconnect}
      />
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    let elements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('5 secondes') || false;
    });
    expect(elements[0]).toBeInTheDocument();

    act(() => {
      rerender(
        <SessionExpiredModal
          isOpen={false}
          onClose={mockOnClose}
          onReconnect={mockOnReconnect}
        />
      );
    });

    act(() => {
      rerender(
        <SessionExpiredModal
          isOpen={true}
          onClose={mockOnClose}
          onReconnect={mockOnReconnect}
        />
      );
    });

    elements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('10 secondes') || false;
    });
    expect(elements[0]).toBeInTheDocument();
  });
});
