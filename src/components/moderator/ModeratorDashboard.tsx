import { SessionRow, ParticipantRow, IcebreakerResponseRow, AssessmentResponseRow, ActivityState, TrackType } from '@/types/domain';
import { QRPanel } from './QRPanel';
import { ActivityControls } from './ActivityControls';
import { ParticipantsCounter } from './ParticipantsCounter';
import { IcebreakerPanel } from './IcebreakerPanel';
import { AssessmentPanel } from './AssessmentPanel';
import { TrackSelector } from './TrackSelector';
import { Logo } from '@/components/common/Logo';

interface ModeratorDashboardProps {
  session: SessionRow;
  participants: ParticipantRow[];
  icebreakerResponses: IcebreakerResponseRow[];
  assessmentResponses: AssessmentResponseRow[];
  onChangeActivity: (activity: ActivityState) => Promise<void>;
  onChangeTrack: (track: TrackType) => Promise<void>;
}

export function ModeratorDashboard({
  session,
  participants,
  icebreakerResponses,
  assessmentResponses,
  onChangeActivity,
  onChangeTrack,
}: ModeratorDashboardProps) {
  const track = session.track ?? 'devops';

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-3">
          <TrackSelector current={track} onChange={onChangeTrack} />
          <span className="hidden font-mono text-xs uppercase tracking-widest text-slate-500 sm:block">
            Proyector / Presentador
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <QRPanel sessionCode={session.code} />
          <ParticipantsCounter participants={participants} />
        </div>

        <div className="space-y-5">
          <ActivityControls current={session.current_activity} onChange={onChangeActivity} />

          {(session.current_activity === 'icebreaker' || session.current_activity === 'waiting') && (
            <IcebreakerPanel responses={icebreakerResponses} track={track} />
          )}

          {(session.current_activity === 'assessment' || session.current_activity === 'results') && (
            <AssessmentPanel
              responses={assessmentResponses}
              participantsCount={participants.length}
              track={track}
            />
          )}
        </div>
      </div>
    </div>
  );
}
