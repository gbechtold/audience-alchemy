import React, {useState, useEffect} from 'react';
import {Save, Download, PlusCircle, Trash2, Wand2} from 'lucide-react';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const FocusGroupConfigurator = () => {
  const [baseGroup, setBaseGroup] = useState({
    name: '',
    totalPeople: 0,
    timeframe: 2.5,
  });

  const [subGroups, setSubGroups] = useState([]);

  // Signal emoji list for unique segment names
  const signalEmojis = ['🌟', '💫', '⚡️', '🔥', '💎', '🚀', '🎯', '💡', '🌈', '✨'];

  useEffect(() => {
    // Load saved data on component mount
    const savedData = localStorage.getItem('focusGroupData');
    if (savedData) {
      const {baseGroup: savedBaseGroup, subGroups: savedSubGroups} = JSON.parse(savedData);
      setBaseGroup(savedBaseGroup);
      setSubGroups(savedSubGroups);
    }
  }, []);

  const calculateTotalReach = () => {
    return baseGroup.totalPeople * baseGroup.timeframe;
  };

  const addSubGroup = () => {
    setSubGroups([
      ...subGroups,
      {
        id: Date.now(),
        name: '',
        signal: signalEmojis[Math.floor(Math.random() * signalEmojis.length)],
        problem: '',
        problemTiming: '',
        problemConsequences: '',
        percentage: 0,
        budget: 0,
        willingnessToPay: 5,
        approach: '',
        priority: subGroups.length + 1,
      },
    ]);
  };

  const removeSubGroup = (id) => {
    setSubGroups(subGroups.filter((group) => group.id !== id));
  };

  const updateSubGroup = (id, field, value) => {
    setSubGroups(subGroups.map((group) => (group.id === id ? {...group, [field]: value} : group)));
  };

  const sortByPriority = () => {
    setSubGroups([...subGroups].sort((a, b) => a.priority - b.priority));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(
      'focusGroupData',
      JSON.stringify({
        baseGroup,
        subGroups,
      })
    );
    alert('✨ Projekt erfolgreich gespeichert!');
  };

  const downloadData = () => {
    const markdown = `# ✨ Audience Alchemy Analysis: ${baseGroup.name}

## 📊 Base Information
- Total People per Year: ${baseGroup.totalPeople}
- Timeframe: ${baseGroup.timeframe} years
- Total Reach: ${calculateTotalReach()} people

## 🎯 Subgroups Analysis

${subGroups
  .map(
    (group) => `
### ${group.signal} Segment ${group.priority}: ${group.name}
- 🌙 Nachts wach wegen: ${group.problem}
- ⏰ Kritischer Zeitpunkt: ${group.problemTiming}
- ⚠️ Konsequenzen ohne Lösung: ${group.problemConsequences}
- 📈 Percentage of Base Group: ${group.percentage}%
- 👥 Affected People: ${((calculateTotalReach() * group.percentage) / 100).toFixed(0)}
- 💰 Budget: ${group.budget}€
- 🎈 Willingness to Pay (1-10): ${group.willingnessToPay}
- 💡 Approach Strategy: ${group.approach}
`
  )
  .join('\n')}`;

    const blob = new Blob([markdown], {type: 'text/markdown'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseGroup.name.toLowerCase().replace(/\s+/g, '-')}-analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getChartData = () => {
    return subGroups.map((group) => {
      // Create display name: either truncated name or default segment number
      const displayName = group.name
        ? group.name.length > 15
          ? group.name.substring(0, 15) + '...'
          : group.name
        : `Segment ${group.priority}`;

      return {
        name: displayName,
        fullName: group.name || `Segment ${group.priority}`, // Original full name for tooltip
        percentage: group.percentage,
        budget: group.budget,
        willingnessToPay: group.willingnessToPay * 10,
        affectedPeople: (calculateTotalReach() * group.percentage) / 100,
      };
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
          ✨ Audience Alchemy Studio ✨
        </h1>
        <p className="text-lg text-gray-600">Schärfen Sie den Blick für Ihre Zielgruppe 🔍</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🌍 Gesamt Zielgruppendefinition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">✨ Gesamtzielgruppe</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={baseGroup.name}
                onChange={(e) => setBaseGroup({...baseGroup, name: e.target.value})}
                placeholder="z.B. Junge Unternehmer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">👥 Personen pro Jahr</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={baseGroup.totalPeople}
                  onChange={(e) => setBaseGroup({...baseGroup, totalPeople: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">⏳ Teil dieser Zielgruppe (Von-Bis Jahre)</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full p-2 border rounded"
                  value={baseGroup.timeframe}
                  onChange={(e) => setBaseGroup({...baseGroup, timeframe: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="text-lg font-semibold">🎯 Gesamtreichweite: {calculateTotalReach()} Personen</div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {subGroups.map((group) => (
          <Card key={group.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">✨ Zielgruppen-Segment {group.priority}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {group.signal} Was macht diese Gruppe erkennbar und einzigartig?
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={group.name}
                    placeholder="z.B. Digitale Pioniere"
                    onChange={(e) => updateSubGroup(group.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">🔍 What keeps you up at night (Problem)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={group.problem}
                    placeholder="Was ist das brennende Problem?"
                    onChange={(e) => updateSubGroup(group.id, 'problem', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">⏰ Wann tritt das Problem auf?</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="z.B. Kurz vor Geschäftseröffnung"
                    value={group.problemTiming}
                    onChange={(e) => updateSubGroup(group.id, 'problemTiming', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">⚠️ Konsequenzen in 3-12 Monaten</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Was passiert, wenn das Problem nicht gelöst wird?"
                    value={group.problemConsequences}
                    onChange={(e) => updateSubGroup(group.id, 'problemConsequences', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">📊 Prozent der Zielgruppe</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={group.percentage}
                    onChange={(e) => updateSubGroup(group.id, 'percentage', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    💰 Kosten - Nutzen dieses Problem zu lösen (€)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={group.budget}
                    onChange={(e) => updateSubGroup(group.id, 'budget', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">🎈 Zahlungsbereitschaft (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="w-full"
                    value={group.willingnessToPay}
                    onChange={(e) => updateSubGroup(group.id, 'willingnessToPay', parseInt(e.target.value))}
                  />
                  <div className="text-center">{group.willingnessToPay}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">🎯 Priorität</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded"
                    value={group.priority}
                    onChange={(e) => updateSubGroup(group.id, 'priority', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    🔄 Dinge die Menschen tun statt dieses Problem zu lösen
                  </label>
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Welche Alternativen nutzen sie aktuell?"
                    value={group.alternativeSolutions}
                    onChange={(e) => updateSubGroup(group.id, 'alternativeSolutions', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">💡 Problem-Ansprache und gewünschte Lösung</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Wie sprechen wir das Problem an und welche Lösung bieten wir?"
                    value={group.approach}
                    onChange={(e) => updateSubGroup(group.id, 'approach', e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => removeSubGroup(group.id)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8 mb-4">
        <button
          onClick={addSubGroup}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          <PlusCircle size={20} /> ✨ Neue Gruppe definieren
        </button>
      </div>

      {subGroups.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📊 Visualisierung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend formatter={(value, entry, index) => <span title={entry?.payload?.fullName}>{value}</span>} />
                  <Bar dataKey="percentage" name="Prozent der Zielgruppe" fill="#8884d8" />
                  <Bar dataKey="affectedPeople" name="Betroffene Personen" fill="#82ca9d" />
                  <Bar dataKey="willingnessToPay" name="Zahlungsbereitschaft (x10)" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={sortByPriority}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          🔄 Update & Sortieren
        </button>
        <button
          onClick={saveToLocalStorage}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          💾 Projekt Speichern
        </button>
        <button
          onClick={downloadData}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          📥 Als Markdown exportieren
        </button>
      </div>
    </div>
  );
};

export default FocusGroupConfigurator;
